// Hook para obtener una orden por ID

import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../services";

export const useGetOrderById = (orderId: string) => {
	return useQuery({
		queryKey: ["crypto-order", orderId],
		queryFn: () => getOrderById(orderId),
		enabled: !!orderId,
	});
};
