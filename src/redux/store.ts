import {
	Dispatch,
	Middleware,
	MiddlewareAPI,
	UnknownAction,
	configureStore,
} from '@reduxjs/toolkit';
import currencyReducer, { setConnected, setRates } from './currencyReducer';

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
			};

			socket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.rates) {
					storeAPI.dispatch(setRates(data.rates));
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
		getDefaultMiddleware().concat(wsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
