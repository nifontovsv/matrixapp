import React from 'react';
import Input from '../Input/Input';
import Button from '../Button/Button';
import styles from './Modal.module.scss';

interface Props {
	selectedCurrency: string;
	currentPrice: number;
	quantity: string;
	onQuantityChange: (value: string) => void;
	onAdd: (e: React.MouseEvent<HTMLButtonElement>) => void;
	onCancel: () => void;
	error: string;
	setError: (value: string) => void;
}

const CurrencyForm: React.FC<Props> = ({
	selectedCurrency,
	currentPrice,
	quantity,
	onQuantityChange,
	onAdd,
	onCancel,
	error,
	setError,
}) => {
	return (
		<div className={styles.addCurrencyBlock}>
			<p className={styles.currencyInfo}>
				<strong>{selectedCurrency}:</strong>{' '}
				<span>{currentPrice.toFixed(5)}</span>
			</p>
			<form className={styles.currencyForm}>
				<Input
					placeholder='Количество'
					value={quantity}
					onChange={(e) => {
						const value = e.target.value;
						onQuantityChange(value);

						if (!isNaN(Number(value)) && value.trim() !== '') {
							error && setError(''); // Убираем ошибку, если есть
						}
					}}
					required
					type='number'
				/>
				{error && <p className={styles.errorMessage}>{error}</p>}
				<div className={styles.currencyBtn}>
					<Button title='Добавить' onClick={onAdd} />
					<Button title='Отмена' onClick={onCancel} />
				</div>
			</form>
		</div>
	);
};

export default CurrencyForm;
