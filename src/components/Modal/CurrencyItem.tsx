import React from 'react';
import styles from './Modal.module.scss';

interface Props {
	currency: string;
	current: number;
	open: number;
	onClick: () => void;
}

const CurrencyItem: React.FC<Props> = ({
	currency,
	current,
	open,
	onClick,
}) => {
	const change = open !== 0 ? ((current - open) / open) * 100 : 0;

	return (
		<div onClick={onClick} className={styles.currencyListItem}>
			<strong>{currency}:</strong>{' '}
			<span>{typeof current === 'number' ? current.toFixed(5) : 'N/A'}</span>
			<span>{typeof change === 'number' ? change.toFixed(2) + '%' : ''}</span>
		</div>
	);
};

export default CurrencyItem;
