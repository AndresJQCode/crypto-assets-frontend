// Tipos para Activos (Balances de criptomonedas)

import type { ExchangeType } from "./exchange.types";

export interface Asset {
	id: string;
	exchangeId: ExchangeType;
	symbol: string; // BTC, ETH, USDT
	name: string; // Bitcoin, Ethereum
	totalQuantity: number;
	availableQuantity: number;
	lockedQuantity: number;
	estimatedValueUSD?: number;
	lastUpdated: string; // ISO date string
	metadata?: Record<string, unknown>; // Datos específicos del exchange
}

export interface AssetBalance {
	assets: Asset[];
	totalValueUSD: number;
	lastUpdated: string;
}
