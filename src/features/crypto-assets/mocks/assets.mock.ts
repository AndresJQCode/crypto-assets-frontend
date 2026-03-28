// Datos mock de activos (balances) de Bybit

import type { Asset, AssetBalance } from "../types";

export const mockAssets: Asset[] = [
	{
		id: "asset-1",
		exchangeId: "bybit",
		symbol: "BTC",
		name: "Bitcoin",
		totalQuantity: 1.5,
		availableQuantity: 1.2,
		lockedQuantity: 0.3,
		estimatedValueUSD: 90000,
		lastUpdated: "2026-02-06T10:00:00Z",
	},
	{
		id: "asset-2",
		exchangeId: "bybit",
		symbol: "ETH",
		name: "Ethereum",
		totalQuantity: 10.5,
		availableQuantity: 8.0,
		lockedQuantity: 2.5,
		estimatedValueUSD: 25000,
		lastUpdated: "2026-02-06T10:00:00Z",
	},
	{
		id: "asset-3",
		exchangeId: "bybit",
		symbol: "USDT",
		name: "Tether USD",
		totalQuantity: 50000,
		availableQuantity: 45000,
		lockedQuantity: 5000,
		estimatedValueUSD: 50000,
		lastUpdated: "2026-02-06T10:00:00Z",
	},
	{
		id: "asset-4",
		exchangeId: "bybit",
		symbol: "SOL",
		name: "Solana",
		totalQuantity: 100,
		availableQuantity: 100,
		lockedQuantity: 0,
		estimatedValueUSD: 15000,
		lastUpdated: "2026-02-06T10:00:00Z",
	},
	{
		id: "asset-5",
		exchangeId: "bybit",
		symbol: "ADA",
		name: "Cardano",
		totalQuantity: 5000,
		availableQuantity: 4500,
		lockedQuantity: 500,
		estimatedValueUSD: 3500,
		lastUpdated: "2026-02-06T10:00:00Z",
	},
];

export const mockAssetBalance: AssetBalance = {
	assets: mockAssets,
	totalValueUSD: mockAssets.reduce((sum, asset) => sum + (asset.estimatedValueUSD || 0), 0),
	lastUpdated: "2026-02-06T10:00:00Z",
};
