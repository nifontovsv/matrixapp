import React from 'react';
import styles from './Main.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { removeCurrency } from '../../redux/currencyReducer';

const Main: React.FC = () => {
	const dispatch = useDispatch();
	const rates = useSelector((state: RootState) => state.currency.rates);
	const currencyList = useSelector(
		(state: RootState) => state.currency.currencyList
	);

	const handleRemoveCurrency = (index: number) => {
		dispatch(removeCurrency(index)); // Удаляем валюту по индексу
	};
	return (
		<main className={styles.main}>
			<div className={styles.mainHeader}>
				<div className={styles.mainHeaderItem}>Название</div>
				<div className={styles.mainHeaderItem}>Количество</div>
				<div className={styles.mainHeaderItem}>Текущая цена</div>
				<div className={styles.mainHeaderItem}>Общая стоимость</div>
				<div className={styles.mainHeaderItem}>Изм. 24ч (%)</div>
				<div className={styles.mainHeaderItem}>Доля в портфеле (%)</div>
			</div>

			<div className={styles.mainListWrapper}>
				{/* Маппим currencyList для отображения всех добавленных валют */}
				{currencyList.map((currencyData, index) => {
					const {
						currency,
						quantity,
						openPrice,
						changePrice,
						totalQuantity,
						sharePercentage,
					} = currencyData;

					// Получаем текущую цену из rates
					const currentPrice = rates[currency]?.current || 0;

					// Рассчитываем общую стоимость
					const totalCost = quantity * currentPrice;

					return (
						<div
							onClick={() => handleRemoveCurrency(index)} // Удаляем валюту по индексу
							key={index}
							className={styles.mainList}
						>
							<div className={styles.mainListItem} data-label='Название'>
								{currency}
							</div>
							<div className={styles.mainListItem} data-label='Количество'>
								{quantity?.toFixed(5)}
							</div>
							<div className={styles.mainListItem} data-label='Текущая цена'>
								${currentPrice.toFixed(5)}
							</div>
							<div className={styles.mainListItem} data-label='Общая стоимость'>
								${totalCost.toFixed(2)}
							</div>
							<div
								className={`${styles.mainListItem} ${
									changePrice > 0 ? styles.positive : styles.negative
								}`}
								data-label='Изм. 24ч (%)'
							>
								{changePrice.toFixed(2)}%
							</div>
							<div
								className={styles.mainListItem}
								data-label='Доля в портфеле (%)'
							>
								{sharePercentage?.toFixed(2)}%
							</div>
						</div>
					);
				})}
			</div>
		</main>
	);
};

export default Main;
