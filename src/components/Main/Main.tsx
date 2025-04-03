import React from 'react';
import styles from './Main.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const Main: React.FC = () => {
	const rates = useSelector((state: RootState) => state.currency.rates);
	const connected = useSelector((state: RootState) => state.currency.connected);

	return (
		<main className={styles.main}>
			<h2>Курсы валют {connected ? '🟢' : '🔴'}</h2>
			<ul>
				{Object.entries(rates).map(([currency, value]) => (
					<li key={currency}>
						<strong>{currency}:</strong> {value.toFixed(2)}
					</li>
				))}
			</ul>
			<div className={styles.mainHeader}>
				<div className={styles.mainHeaderItem}>Название</div>
				<div className={styles.mainHeaderItem}>Количество</div>
				<div className={styles.mainHeaderItem}>Текущая цена</div>
				<div className={styles.mainHeaderItem}>Общая стоимость</div>
				<div className={styles.mainHeaderItem}>Изм. 24ч (%)</div>
				<div className={styles.mainHeaderItem}>Доля в портфеле (%)</div>
			</div>

			<div className={styles.mainList}>
				<div className={styles.mainListItem} data-label='Название'>
					USD
				</div>
				<div className={styles.mainListItem} data-label='Количество'>
					1500
				</div>
				<div className={styles.mainListItem} data-label='Текущая цена'>
					$1
				</div>
				<div className={styles.mainListItem} data-label='Общая стоимость'>
					$1500
				</div>
				<div
					className={`${styles.mainListItem} ${styles.positive}`}
					data-label='Изм. 24ч (%)'
				>
					+0.5%
				</div>
				<div className={styles.mainListItem} data-label='Доля в портфеле (%)'>
					40%
				</div>
			</div>
		</main>
	);
};

export default Main;
