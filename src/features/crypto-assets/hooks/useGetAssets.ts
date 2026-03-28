// Hook para obtener lista de activos

import { useQuery } from "@tanstack/react-query";
import { getAssets } from "../services";

export const useGetAssets = (exchangeId: string) => {
	return useQuery({
		queryKey: ["crypto-assets", exchangeId],
		queryFn: () => getAssets(exchangeId),
		enabled: !!exchangeId,
	});
};
