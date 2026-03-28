// Utilidades para formateo de datos de crypto assets

export const formatCryptoAmount = (amount: number, symbol: string, decimals = 8): string => {
	return `${amount.toFixed(decimals)} ${symbol}`;
};

export const formatUSD = (amount: number): string => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(amount);
};

export const formatPercentage = (value: number): string => {
	return `${(value * 100).toFixed(2)}%`;
};

export const formatDate = (date: string): string => {
	return new Intl.DateTimeFormat("es-ES", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
};

export const formatCompactNumber = (value: number): string => {
	if (value >= 1000000) {
		return `${(value / 1000000).toFixed(2)}M`;
	}
	if (value >= 1000) {
		return `${(value / 1000).toFixed(2)}K`;
	}
	return value.toFixed(2);
};
