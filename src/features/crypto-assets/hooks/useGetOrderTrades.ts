// Hook para obtener trades/fills de una orden

import { useQuery } from "@tanstack/react-query";
import { getOrderTrades } from "../services";

export const useGetOrderTrades = (orderId: string) => {
	return useQuery({
		queryKey: ["crypto-order-trades", orderId],
		queryFn: () => getOrderTrades(orderId),
		enabled: !!orderId,
	});
};
