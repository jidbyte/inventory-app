export function useCurrency(locale: string = 'en-US', currency: string = 'USD') {
	const formatter = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: currency
	});

	return {
		format: (amount: number) => formatter.format(amount)
	};
}

// Format currency with configurable currency code
export const formatCurrency = (currency: string, amount: number) => {
	const { format } = useCurrency('en-US', currency);
	return format(amount);
};
