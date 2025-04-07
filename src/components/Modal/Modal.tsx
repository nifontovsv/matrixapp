import React, { useRef, useState } from 'react';
import styles from './Modal.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
	addCurrency,
	closeModal,
	updateSharePercentage,
} from '../../redux/currencyReducer';
import Input from '../Input/Input';
import CurrencyList from './CurrencyList';
import CurrencyForm from './CurrencyForm';
import { useOutsideClick } from './useOutsideClick';

const Modal: React.FC = () => {
	const dispatch = useDispatch();
	const isOpen = useSelector((state: RootState) => state.currency.isOpen);
	const rates = useSelector((state: RootState) => state.currency.rates);
	const connected = useSelector((state: RootState) => state.currency.connected);

	const modalRef = useRef<HTMLDivElement>(null);
	const [query, setQuery] = useState('');
	const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
	const [quantity, setQuantity] = useState('');
	const [error, setError] = useState('');

	const filtered = Object.entries(rates).filter(([currency]) =>
		currency.toLowerCase().startsWith(query.toLowerCase())
	);

	useOutsideClick(modalRef, handleClose, isOpen);

	function handleClose() {
		setSelectedCurrency(null);
		setQuery('');
		setQuantity('');
		setError('');
		dispatch(closeModal());
	}

	const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		if (!quantity || isNaN(Number(quantity))) {
			setError('Введите число');
			return;
		}

		if (selectedCurrency) {
			dispatch(
				addCurrency({
					currency: selectedCurrency,
					quantity: parseFloat(quantity),
					openPrice: rates[selectedCurrency].open,
					currentPrice: rates[selectedCurrency].current,
				})
			);
			dispatch(updateSharePercentage());
			handleClose();
		}
	};

	if (!isOpen) return null;

	try {
		return (
			<div className={styles.modalWindow}>
				<div ref={modalRef} className={styles.currencyList}>
					<div className={styles.currencyBlockSearch}>
						<h3 className={styles.currencyListTitle}>
							Курсы валют {connected ? '🟢' : '🔴'}
						</h3>
						<Input
							placeholder='Поиск валюты'
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							type='text'
						/>
					</div>
					<div className={styles.currencyListItemWrapper}>
						<CurrencyList filtered={filtered} onSelect={setSelectedCurrency} />
					</div>
					{selectedCurrency && rates[selectedCurrency] && (
						<CurrencyForm
							selectedCurrency={selectedCurrency}
							currentPrice={rates[selectedCurrency]?.current}
							quantity={quantity}
							onQuantityChange={setQuantity}
							onAdd={handleAdd}
							onCancel={handleClose}
							error={error}
							setError={setError}
						/>
					)}
				</div>
			</div>
		);
	} catch (error) {
		console.error('Ошибка в Modal:', error);
		return <div>Произошла ошибка</div>;
	}
};

export default Modal;
