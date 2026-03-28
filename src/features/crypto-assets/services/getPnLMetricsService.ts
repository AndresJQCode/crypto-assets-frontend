// Servicio para calcular métricas de PnL

import { mockOrders } from "../mocks/orders.mock";
import { getOrderStatus } from "../types";

export interface PnLMetrics {
	totalPnL: number;
	realizedPnL: number;
	unrealizedPnL: number;
	winRate: number;
	totalTrades: number;
}

export const getPnLMetrics = async (): Promise<PnLMetrics> => {
	// Simular latencia de red
	await new Promise((resolve) => setTimeout(resolve, 200));

	// Calcular PnL realizado (órdenes cerradas ejecutadas)
	const closedOrders = mockOrders.filter((order) => getOrderStatus(order.state) === "closed");
	const filledClosedOrders = closedOrders.filter((order) => order.state === "Filled");

	// Para órdenes cerradas, el PnL se calcula como la diferencia entre precio de venta y compra
	// En este mock simplificado, asumimos un PnL realizado basado en el valor total
	const realizedPnL = filledClosedOrders.reduce((sum, order) => {
		// Simulación: ganancia/pérdida promedio del 2-5% sobre el valor total
		const pnlFactor = Math.random() > 0.5 ? 1 : -1;
		const pnlPercentage = (Math.random() * 3 + 2) / 100; // 2-5%
		return sum + (order.totalValue || 0) * pnlPercentage * pnlFactor;
	}, 0);

	// Calcular PnL no realizado (órdenes abiertas)
	const openOrders = mockOrders.filter((order) => getOrderStatus(order.state) === "open");
	const unrealizedPnL = openOrders.reduce((sum, order) => sum + (order.pnl || 0), 0);

	// PnL total
	const totalPnL = realizedPnL + unrealizedPnL;

	// Calcular tasa de éxito (win rate)
	const profitableClosedOrders = filledClosedOrders.filter(() => Math.random() > 0.4); // 60% win rate simulado
	const winRate = filledClosedOrders.length > 0 ? (profitableClosedOrders.length / filledClosedOrders.length) * 100 : 0;

	return {
		totalPnL,
		realizedPnL,
		unrealizedPnL,
		winRate,
		totalTrades: closedOrders.length,
	};
};
