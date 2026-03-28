// Hook para obtener eventos de una orden

import { useQuery } from "@tanstack/react-query";
import { getOrderEvents } from "../services";

export const useGetOrderEvents = (orderId: string) => {
	return useQuery({
		queryKey: ["crypto-order-events", orderId],
		queryFn: () => getOrderEvents(orderId),
		enabled: !!orderId,
	});
};
