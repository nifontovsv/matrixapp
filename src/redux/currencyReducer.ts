import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface CurrencyState {
	rates: Record<string, number>;
	connected: boolean;
}

const loadFromLocalStorage = (): CurrencyState => {
	try {
		const saveData = localStorage.getItem('currencyRates');
		return saveData ? JSON.parse(saveData) : { rates: {}, connected: false };
	} catch (error) {
		console.error('Ошибка загрузки из localStorage', error);
		return { rates: {}, connected: false };
	}
};

const initialState: CurrencyState = loadFromLocalStorage();

const currencySlice = createSlice({
	name: 'currency',
	initialState,
	reducers: {
		setRates: (state, action: PayloadAction<Record<string, number>>) => {
			state.rates = action.payload;
			localStorage.setItem('currencyRates', JSON.stringify(state));
		},
		setConnected: (state, action: PayloadAction<boolean>) => {
			state.connected = action.payload;
		},
	},
});

export const { setRates, setConnected } = currencySlice.actions;
export default currencySlice.reducer;
