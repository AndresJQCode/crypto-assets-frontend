// Hook para obtener balance total de activos

import { useQuery } from "@tanstack/react-query";
import { getAssetBalance } from "../services";

export const useGetAssetBalance = (exchangeId: string) => {
	return useQuery({
		queryKey: ["crypto-asset-balance", exchangeId],
		queryFn: () => getAssetBalance(exchangeId),
		enabled: !!exchangeId,
	});
};
