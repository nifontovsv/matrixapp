import React, { useEffect, useRef, useState } from 'react';
import styles from './Modal.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
	addCurrency,
	closeModal,
	updateSharePercentage,
} from '../../redux/currencyReducer';
import Input from '../Input/Input';
import Button from '../Button/Button';

const Modal: React.FC = () => {
	const dispatch = useDispatch();
	const isOpen = useSelector((state: RootState) => state.currency.isOpen);
	const rates = useSelector((state: RootState) => state.currency.rates);
	const connected = useSelector((state: RootState) => state.currency.connected);

	const modalRef = useRef<HTMLDivElement>(null);
	const [query, setQuery] = useState('');
	const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
	const [quantity, setQuantity] = useState('');
	const [previousPrice, setPreviousPrice] = useState<number | null>(null);

	const filtered = Object.entries(rates).filter(([currency, value]) =>
		currency.toLowerCase().startsWith(query.toLowerCase())
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				setSelectedCurrency(null);
				setQuery('');
				setQuantity('');
				setPreviousPrice(0);
				dispatch(closeModal());
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, dispatch]);

	if (!isOpen) return null;

	useEffect(() => {
		if (selectedCurrency) {
			setPreviousPrice(rates[selectedCurrency]);
		}
	}, [selectedCurrency, rates]);

	const addCurrencyCLick = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (selectedCurrency && quantity && previousPrice !== null) {
			dispatch(
				addCurrency({
					currency: selectedCurrency,
					quantity: parseFloat(quantity),
					previousPrice,
					currentPrice: rates[selectedCurrency],
				})
			);
			dispatch(updateSharePercentage());
		}
	};

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
					{filtered.length > 0 ? (
						filtered.map(([currency, value]) => (
							<div
								onClick={() => setSelectedCurrency(currency)}
								key={currency}
								className={styles.currencyListItem}
							>
								<strong>{currency}:</strong> <span>{value.toFixed(5)}</span>
								<span>+0.16%</span>
							</div>
						))
					) : (
						<div className={styles.noCurrencyFound}>Ничего не найдено</div>
					)}
				</div>
				{selectedCurrency && (
					<div className={styles.addCurrencyBlock}>
						<p className={styles.currencyInfo}>
							<strong>{selectedCurrency}:</strong>{' '}
							<span>{rates[selectedCurrency].toFixed(5)}</span>
						</p>
						<form className={styles.currencyForm}>
							<Input
								placeholder='Количество'
								value={quantity}
								onChange={(e) => setQuantity(e.target.value)}
								required
								type='number'
							/>
							<div className={styles.currencyBtn}>
								<Button title='Добавить' onClick={addCurrencyCLick} />
								<Button
									title='Отмена'
									onClick={() => setSelectedCurrency(null)}
								/>
							</div>
						</form>
					</div>
				)}
			</div>
		</div>
	);
};

export default Modal;
