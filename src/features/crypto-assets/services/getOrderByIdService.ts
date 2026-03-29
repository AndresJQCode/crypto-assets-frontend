// Servicio para obtener una orden por ID

import { apiClient } from "@/lib/api-client";
import type { Order } from "../types";

export const getOrderById = async (orderId: string): Promise<Order> => {
	return apiClient.get<Order>(`/api/orders/${orderId}`);
};
