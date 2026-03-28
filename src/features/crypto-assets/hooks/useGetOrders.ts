// Hook para obtener lista paginada de órdenes

import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../services";
import type { OrderFilters } from "../types";

export const useGetOrders = (page = 1, limit = 10, filters?: OrderFilters) => {
	return useQuery({
		queryKey: ["crypto-orders", page, limit, filters],
		queryFn: () => getOrders(page, limit, filters),
	});
};
