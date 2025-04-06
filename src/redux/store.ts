import { Middleware, configureStore } from '@reduxjs/toolkit';
import currencyReducer, { setConnected, setRates } from './currencyReducer';

const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
	const result = next(action);

	const actionsToSave = [
		'currency/setRates',
		'currency/setConnected',
		'currency/openModal',
		'currency/closeModal',
		'currency/addCurrency',
		'currency/removeCurrency',
		'currency/updateSharePercentage',
	];

	if (
		typeof action === 'object' &&
		action !== null &&
		'type' in action &&
		typeof action.type === 'string' &&
		actionsToSave.includes(action.type)
	) {
		const state = store.getState().currency;
		try {
			localStorage.setItem('currencyRates', JSON.stringify(state));
		} catch (error) {
			console.error('Ошибка сохранения в localStorage', error);
		}
	}

	return result;
};

let socket: WebSocket | null = null;

const wsMiddleware: Middleware = (storeAPI) => (next) => (action) => {
	if ((action as { type: string }).type === 'START_WEBSOCKET') {
		if (socket) socket.close();
		socket = new WebSocket('wss://stream.binance.com:9443/stream?streams');

		socket.onopen = () => {
			storeAPI.dispatch(setConnected(true));
			console.log('WebSocket подключён!');
			const payload = {
				method: 'SUBSCRIBE',
				params: [
					'btcusdt@ticker',
					'ethusdt@ticker',
					'bnbusdt@ticker',
					'xrpusdt@ticker',
					'adausdt@ticker',
					'solusdt@ticker',
					'dogeusdt@ticker',
					'dotusdt@ticker',
					'maticusdt@ticker',
					'ltcusdt@ticker',
				],
				id: 1,
			};
			socket!.send(JSON.stringify(payload));
		};

		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			console.log('WebSocket message:', message);
			if (message.data?.s && message.data?.c && message.data?.o) {
				const currency = message.data.s;
				const price = parseFloat(message.data.c);
				const openPrice = parseFloat(message.data.o);

				storeAPI.dispatch(
					setRates({
						...storeAPI.getState().currency.rates,
						[currency]: {
							current: price,
							open: openPrice,
						},
					})
				);
			}
		};

		socket.onclose = () => {
			storeAPI.dispatch(setConnected(false));
			console.log('WebSocket отключён! Переподключение...');
			setTimeout(() => storeAPI.dispatch({ type: 'START_WEBSOCKET' }), 5000);
		};
	}

	return next(action);
};

export const store = configureStore({
	reducer: {
		currency: currencyReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(wsMiddleware, localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
