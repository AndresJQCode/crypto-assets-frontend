// Servicio para obtener lista paginada de órdenes

import type { PaginatedData } from "@/types/common";
import { mockOrders } from "../mocks/orders.mock";
import type { Order, OrderFilters } from "../types";
import { getOrderStatus } from "../types";

export const getOrders = async (page = 1, limit = 10, filters?: OrderFilters): Promise<PaginatedData<Order>> => {
	// Simular latencia de red
	await new Promise((resolve) => setTimeout(resolve, 300));

	let filteredOrders = [...mockOrders];

	// Aplicar filtros
	if (filters?.exchangeId) {
		filteredOrders = filteredOrders.filter((o) => o.exchangeId === filters.exchangeId);
	}
	if (filters?.status) {
		filteredOrders = filteredOrders.filter((o) => getOrderStatus(o.state) === filters.status);
	}
	if (filters?.state) {
		filteredOrders = filteredOrders.filter((o) => o.state === filters.state);
	}
	if (filters?.side) {
		filteredOrders = filteredOrders.filter((o) => o.side === filters.side);
	}
	if (filters?.type) {
		filteredOrders = filteredOrders.filter((o) => o.type === filters.type);
	}
	if (filters?.pair) {
		filteredOrders = filteredOrders.filter((o) =>
			o.pair.symbol.toLowerCase().includes(filters.pair?.toLowerCase() || ""),
		);
	}

	// Ordenar por fecha de creación (más reciente primero)
	filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

	// Paginación
	const start = (page - 1) * limit;
	const end = start + limit;
	const paginatedOrders = filteredOrders.slice(start, end);

	return {
		data: paginatedOrders,
		totalCount: filteredOrders.length,
		totalPages: Math.ceil(filteredOrders.length / limit),
		page,
		limit,
	};
};
