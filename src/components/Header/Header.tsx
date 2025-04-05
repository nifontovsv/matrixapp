import React from 'react';
import styles from './Header.module.scss';
import Button from '../Button/Button';
import { useDispatch } from 'react-redux';
import { openModal } from '../../redux/currencyReducer';

const Header: React.FC = () => {
	const dispatch = useDispatch();
	return (
		<header className={styles.header}>
			<h1 className={styles.logo}>PORTFOLIO OVERVIEW</h1>
			<Button title='Add' onClick={() => dispatch(openModal())} />
		</header>
	);
};

export default Header;
