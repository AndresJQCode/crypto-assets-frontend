// Servicio para obtener una orden por ID

import { mockOrders } from "../mocks/orders.mock";
import type { Order } from "../types";

export const getOrderById = async (orderId: string): Promise<Order> => {
	// Simular latencia de red
	await new Promise((resolve) => setTimeout(resolve, 150));

	const order = mockOrders.find((o) => o.id === orderId);

	if (!order) {
		throw new Error(`Order with id ${orderId} not found`);
	}

	return order;
};
