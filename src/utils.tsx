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
