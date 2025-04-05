import styles from './Button.module.scss';

interface ButtonProps {
	title: string;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ title, onClick }) => {
	return (
		<button onClick={onClick} className={styles.btnAdd}>
			{title}
		</button>
	);
};

export default Button;
