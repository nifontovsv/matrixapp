import { useEffect, RefObject } from 'react';

export const useOutsideClick = (
	ref: RefObject<HTMLElement | null>,
	callback: () => void,
	isActive: boolean
) => {
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				callback();
			}
		};

		if (isActive) {
			document.addEventListener('mousedown', handler);
		}
		return () => document.removeEventListener('mousedown', handler);
	}, [isActive, callback, ref]);
};
