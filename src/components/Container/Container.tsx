import React, { ReactNode } from 'react';
import styles from './Container.module.scss';

interface Props {
	children: ReactNode;
}

const Container: React.FC<Props> = ({ children }) => {
	return <section className={styles.container}>{children}</section>;
};

export default Container;
