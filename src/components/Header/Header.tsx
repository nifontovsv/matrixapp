import React from 'react';
import styles from './Header.module.scss';

const Header: React.FC = () => {
	return (
		<header className={styles.header}>
			<h1 className={styles.logo}>PORTFOLIO OVERVIEW</h1>
			<button className={styles.btnAdd}>Add</button>
		</header>
	);
};

export default Header;
