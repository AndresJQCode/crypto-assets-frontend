// Servicio para calcular métricas de PnL

import { apiClient } from "@/lib/api-client";

export interface PnLMetrics {
	totalPnL: number;
	realizedPnL: number;
	unrealizedPnL: number;
	winRate: number;
	totalTrades: number;
}

export const getPnLMetrics = async (): Promise<PnLMetrics> => {
	return apiClient.get<PnLMetrics>("/api/pnl-metrics");
};
