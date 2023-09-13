export const debounce = (func: (...params: any[]) => any, waitTime: number) => {
	let timer: number | undefined | null;
	return function (...args: any[]) {
		const context = this;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			timer = null;
			func.apply(context, args);
		}, waitTime);
	};
};

export function throttle(fn, delay: number) {
	let run = false;
	return function (...args) {
		if (!run) {
			fn(...args);
			run = true;
			setTimeout(() => (run = false), delay);
		}
	};
}
