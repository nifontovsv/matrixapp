import React from 'react';
import CurrencyItem from './CurrencyItem';
import styles from './Modal.module.scss';

interface Props {
	filtered: [string, { current: number; open: number }][];
	onSelect: (currency: string) => void;
}

const CurrencyList: React.FC<Props> = ({ filtered, onSelect }) => {
	if (filtered.length === 0) {
		return <div className={styles.noCurrencyFound}>Ничего не найдено</div>;
	}

	return (
		<>
			{filtered
				.filter(
					([_, value]) =>
						typeof value.current === 'number' && typeof value.open === 'number'
				)
				.map(([currency, value]) => (
					<CurrencyItem
						key={currency}
						currency={currency}
						current={value.current}
						open={value.open}
						onClick={() => onSelect(currency)}
					/>
				))}
		</>
	);
};

export default CurrencyList;
