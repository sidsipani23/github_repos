/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
export const debounce = (func: (...params: any[]) => any, waitTime: number) => {
	let timer: number | undefined | null;
	return function (...args: any[]) {
		//@ts-ignore
		const context = this;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			timer = null;
			func.apply(context, args);
		}, waitTime);
	};
};

export function throttle(fn: (...params: any[]) => any, delay: number) {
	let run = false;
	return function (...args: any) {
		if (!run) {
			fn(...args);
			run = true;
			setTimeout(() => (run = false), delay);
		}
	};
}
