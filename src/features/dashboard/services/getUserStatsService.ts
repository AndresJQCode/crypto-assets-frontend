import { endpoints } from "../constants";
import { type DashboardMetric, dashboardMetricsArraySchema } from "../types";

export const getUserStats = async (): Promise<DashboardMetric[]> => {
	const response = await fetch(endpoints.metrics());

	if (!response.ok) {
		throw new Error(`Error al obtener estadísticas de usuarios: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	const result = dashboardMetricsArraySchema.safeParse(data);

	if (!result.success) {
		console.error("API response validation failed:", result.error.format());
		throw new Error("La respuesta del servidor no tiene el formato esperado");
	}

	return result.data;
};
