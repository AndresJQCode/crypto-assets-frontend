// Servicio para obtener eventos de una orden

import { mockOrderEvents } from "../mocks/events.mock";
import type { OrderEvent } from "../types";

export const getOrderEvents = async (orderId: string): Promise<OrderEvent[]> => {
	// Simular latencia de red
	await new Promise((resolve) => setTimeout(resolve, 150));

	return mockOrderEvents[orderId] || [];
};
