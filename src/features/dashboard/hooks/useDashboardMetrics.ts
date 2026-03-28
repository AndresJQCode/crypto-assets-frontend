import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "../services";
import type { DashboardMetric } from "../types";

export const useDashboardMetrics = () => {
	return useQuery({
		queryKey: ["dashboard", "metrics"],
		queryFn: getUserStats,
		staleTime: 5 * 60 * 1000, // 5 minutos
		refetchOnWindowFocus: false,
		select: (data: DashboardMetric[]): DashboardMetric[] => {
			// Transformar los datos de la API en métricas para las tarjetas
			return data;
		},
	});
};
