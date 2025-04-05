import styles from './Input.module.scss';

interface InputProps {
	placeholder: string;
	value: string | number;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	type: string;
}

const Input: React.FC<InputProps> = ({
	placeholder,
	value,
	onChange,
	required = false,
	type,
}) => {
	return (
		<label>
			<input
				className={styles.inputCurrencySearch}
				type='text'
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				required={required}
			/>
		</label>
	);
};

export default Input;
