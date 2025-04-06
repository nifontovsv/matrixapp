import React from 'react';
import styles from './Main.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { removeCurrency } from '../../redux/currencyReducer';

const Main: React.FC = () => {
	const dispatch = useDispatch();
	const currencyList = useSelector(
		(state: RootState) => state.currency.currencyList
	);
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
				{currencyList.map((item, index) => (
					<div
						onClick={() => dispatch(removeCurrency(index))}
						key={index}
						className={styles.mainList}
					>
						<div className={styles.mainListItem} data-label='Название'>
							{item.currency}
						</div>
						<div className={styles.mainListItem} data-label='Количество'>
							{item.quantity.toFixed(5)}
						</div>
						<div className={styles.mainListItem} data-label='Текущая цена'>
							${item.totalQuantity / item.quantity}
						</div>
						<div className={styles.mainListItem} data-label='Общая стоимость'>
							${item.totalQuantity.toFixed(2)}
						</div>
						<div
							className={`${styles.mainListItem} ${
								item.changePrice > 0 ? styles.positive : styles.negative
							}`}
							data-label='Изм. 24ч (%)'
						>
							{item.changePrice.toFixed(2)}%
						</div>
						<div
							className={styles.mainListItem}
							data-label='Доля в портфеле (%)'
						>
							{item.sharePercentage.toFixed(2)}%
						</div>
					</div>
				))}
			</div>
		</main>
	);
};

export default Main;
