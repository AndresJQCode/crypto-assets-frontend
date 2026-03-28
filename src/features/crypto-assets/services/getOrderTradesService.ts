// Servicio para obtener trades/fills de una orden

import { mockOrderTrades } from "../mocks/trades.mock";
import type { Trade } from "../types";

export const getOrderTrades = async (orderId: string): Promise<Trade[]> => {
	// Simular latencia de red
	await new Promise((resolve) => setTimeout(resolve, 150));

	return mockOrderTrades[orderId] || [];
};
