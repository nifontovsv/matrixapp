import {
	Dispatch,
	Middleware,
	MiddlewareAPI,
	UnknownAction,
	configureStore,
} from '@reduxjs/toolkit';
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

	if (actionsToSave.includes(action.type)) {
		const state = store.getState().currency;
		try {
			localStorage.setItem('currencyRates', JSON.stringify(state));
		} catch (error) {
			console.error('Ошибка сохранения в localStorage', error);
		}
	}

	return result;
};

const wsMiddleware: Middleware<{}, any, Dispatch<UnknownAction>> = (
	storeAPI: MiddlewareAPI<Dispatch<UnknownAction>, any>
) => {
	let socket: WebSocket | null = null;

	return (next: Dispatch<UnknownAction>) => (action: UnknownAction) => {
		if (action.type === 'START_WEBSOCKET') {
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
				if (
					message.data &&
					message.data.s &&
					message.data.c &&
					message.data.o
				) {
					const currency = message.data.s;
					const price = parseFloat(message.data.c);
					const openPrice = parseFloat(message.data.o);

					storeAPI.dispatch(
						setRates({
							...storeAPI.getState().currency.rates,
							[currency]: price,
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
