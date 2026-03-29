// Servicio para obtener lista paginada de órdenes

import { apiClient } from "@/lib/api-client";
import type { PaginatedData } from "@/types/common";
import type { Order, OrderFilters } from "../types";

export const getOrders = async (page = 1, limit = 10, filters?: OrderFilters): Promise<PaginatedData<Order>> => {
	// Construir query parameters
	const params: Record<string, string | number | boolean | undefined> = {
		page,
		limit,
	};

	// Agregar filtros si existen
	if (filters?.exchangeId) {
		params.connectorInstanceId = filters.exchangeId;
	}
	if (filters?.status) {
		params.status = filters.status;
	}
	if (filters?.state) {
		params.state = filters.state;
	}
	if (filters?.side) {
		params.side = filters.side;
	}
	if (filters?.type) {
		params.type = filters.type;
	}
	if (filters?.pair) {
		params.pair = filters.pair;
	}
	if (filters?.dateFrom) {
		params.dateFrom = filters.dateFrom;
	}
	if (filters?.dateTo) {
		params.dateTo = filters.dateTo;
	}

	// Llamar al backend
	return apiClient.get<PaginatedData<Order>>("/api/orders", { params });
};
