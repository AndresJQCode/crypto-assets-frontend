// Hook para obtener métricas de PnL

import { useQuery } from "@tanstack/react-query";
import { getPnLMetrics } from "../services/getPnLMetricsService";

export const useGetPnLMetrics = () => {
	return useQuery({
		queryKey: ["crypto-pnl-metrics"],
		queryFn: getPnLMetrics,
		staleTime: 30000, // Refrescar cada 30 segundos
	});
};
