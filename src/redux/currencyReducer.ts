import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type CurrencyItem = {
	currency: string;
	quantity: number;
	totalQuantity: number;
	openPrice: number;
	changePrice: number;
	sharePercentage: number;
};

interface CurrencyState {
	connected: boolean;
	isOpen: boolean;
	currencyList: CurrencyItem[];
	rates: Record<string, { current: number; open: number }>;
}

const saveToLocalStorage = (state: CurrencyState) => {
	try {
		const serializedState = {
			connected: state.connected,
			isOpen: state.isOpen,
			currencyList: state.currencyList,
			rates: state.rates,
		};
		localStorage.setItem('currencyRates', JSON.stringify(serializedState));
	} catch (error) {
		console.error('Ошибка сохранения в localStorage', error);
	}
};

const loadFromLocalStorage = (): CurrencyState => {
	try {
		const saveData = localStorage.getItem('currencyRates');
		const parsed = saveData ? JSON.parse(saveData) : null;

		if (
			parsed &&
			typeof parsed.connected === 'boolean' &&
			typeof parsed.isOpen === 'boolean' &&
			Array.isArray(parsed.currencyList) &&
			parsed.rates &&
			typeof parsed.rates === 'object'
		) {
			return parsed;
		}
	} catch (error) {
		console.error('Ошибка загрузки из localStorage', error);
	}
	return {
		connected: false,
		isOpen: false,
		currencyList: [],
		rates: {},
	};
};

const initialState: CurrencyState = loadFromLocalStorage();

const currencySlice = createSlice({
	name: 'currency',
	initialState,
	reducers: {
		setRates: (
			state,
			action: PayloadAction<Record<string, { current: number; open: number }>>
		) => {
			state.rates = action.payload;
		},
		setConnected: (state, action: PayloadAction<boolean>) => {
			state.connected = action.payload;
		},
		openModal: (state) => {
			state.isOpen = true;
		},
		closeModal: (state) => {
			state.isOpen = false;
		},
		setFullRates: (
			state,
			action: PayloadAction<{
				[key: string]: { current: number; open: number };
			}>
		) => {
			for (const key in action.payload) {
				state.rates[key] = action.payload[key].current;
			}
		},
		addCurrency: (
			state,
			action: PayloadAction<{
				currency: string;
				quantity: number;
				openPrice: number;
				currentPrice: number;
			}>
		) => {
			const { currency, quantity, openPrice, currentPrice } = action.payload;
			const changePrice = openPrice
				? ((currentPrice - openPrice) / openPrice) * 100
				: 0;

			const totalQuantity = quantity * currentPrice;

			state.currencyList.push({
				currency,
				quantity,
				totalQuantity,
				openPrice,
				changePrice,
				sharePercentage: 0,
			});
		},

		updateSharePercentage: (state) => {
			const totalPortfolioValue = state.currencyList.reduce(
				(sum, item) => sum + item.totalQuantity,
				0
			);

			state.currencyList.forEach((item) => {
				item.sharePercentage = (item.totalQuantity / totalPortfolioValue) * 100;
			});
		},

		removeCurrency: (state, action: PayloadAction<number>) => {
			state.currencyList.splice(action.payload, 1);
		},
	},
});

export const {
	setRates,
	setConnected,
	openModal,
	closeModal,
	addCurrency,
	updateSharePercentage,
	removeCurrency,
} = currencySlice.actions;
export default currencySlice.reducer;
