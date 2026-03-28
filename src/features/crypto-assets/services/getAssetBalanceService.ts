// Servicio para obtener balance total de activos

import { mockAssetBalance } from "../mocks/assets.mock";
import type { AssetBalance } from "../types";

export const getAssetBalance = async (exchangeId: string): Promise<AssetBalance> => {
	// Simular latencia de red
	await new Promise((resolve) => setTimeout(resolve, 200));

	return {
		...mockAssetBalance,
		assets: mockAssetBalance.assets.filter((a) => a.exchangeId === exchangeId),
		totalValueUSD: mockAssetBalance.assets
			.filter((a) => a.exchangeId === exchangeId)
			.reduce((sum, asset) => sum + (asset.estimatedValueUSD || 0), 0),
	};
};
