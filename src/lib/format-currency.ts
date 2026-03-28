export const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
};

export const formatValueInput = (value: string) => {
	if (value === "" || value === "-") return "";
	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		maximumFractionDigits: 0,
	}).format(Number(value.replace(/[^0-9-]/g, "")));
};
