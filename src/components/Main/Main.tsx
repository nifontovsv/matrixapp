import React, { useEffect } from 'react';
import styles from './Main.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {
	removeCurrency,
	updateCurrencyChangePrice,
} from '../../redux/currencyReducer';

const Main: React.FC = () => {
	const dispatch = useDispatch();
	const rates = useSelector((state: RootState) => state.currency.rates);
	const currencyList = useSelector(
		(state: RootState) => state.currency.currencyList
	);

	useEffect(() => {
		Object.keys(rates).forEach((currency) => {
			const { current } = rates[currency];
			dispatch(updateCurrencyChangePrice({ currency, currentPrice: current }));
		});
	}, [rates, dispatch]);

	const handleRemoveCurrency = (index: number) => {
		dispatch(removeCurrency(index));
	};

	const headerTableInfo = [
		'Название',
		'Количество',
		'Текущая цена',
		'Общая стоимость',
		'Изм. 24ч (%)',
		'Доля в портфеле (%)',
	];

	if (currencyList.length === 0) {
		return (
			<div className={styles.empty}>
				<h2>Пока что здесь пусто! Добавьте что-нибудь...</h2>
			</div>
		);
	}

	return (
		<main className={styles.main}>
			<div className={styles.mainHeader}>
				{headerTableInfo.map((item, index) => (
					<div key={index} className={styles.mainHeaderItem}>
						{item}
					</div>
				))}
			</div>

			<div className={styles.mainListWrapper}>
				{currencyList.map((currencyData, index) => {
					const { currency, quantity, changePrice, sharePercentage } =
						currencyData;
					const currentPrice = rates[currency]?.current || 0;
					const totalCost = quantity * currentPrice;

					return (
						<div
							onClick={() => handleRemoveCurrency(index)}
							key={index}
							className={styles.mainList}
						>
							{[
								{ label: 'Название', value: currency },
								{ label: 'Количество', value: quantity?.toFixed(5) },
								{ label: 'Текущая цена', value: `$${currentPrice.toFixed(5)}` },
								{ label: 'Общая стоимость', value: `$${totalCost.toFixed(2)}` },
								{
									label: 'Изм. 24ч (%)',
									value: `${changePrice.toFixed(2)}%`,
									extraClass:
										changePrice > 0
											? styles.positive
											: changePrice < 0
											? styles.negative
											: styles.neutral,
								},
								{
									label: 'Доля в портфеле (%)',
									value: `${sharePercentage?.toFixed(2)}%`,
								},
							].map(({ label, value, extraClass }, i) => (
								<div
									key={i}
									className={`${styles.mainListItem} ${
										extraClass ?? ''
									}`.trim()}
									data-label={label}
								>
									{value}
								</div>
							))}
						</div>
					);
				})}
			</div>
		</main>
	);
};

export default Main;
