// Servicio para obtener lista de activos

import { mockAssets } from "../mocks/assets.mock";
import type { Asset } from "../types";

export const getAssets = async (exchangeId: string): Promise<Asset[]> => {
	// Simular latencia de red
	await new Promise((resolve) => setTimeout(resolve, 200));

	return mockAssets.filter((asset) => asset.exchangeId === exchangeId);
};
