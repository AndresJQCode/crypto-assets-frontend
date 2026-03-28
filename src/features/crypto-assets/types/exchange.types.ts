// Tipos para Exchanges (plataformas de trading)

export type ExchangeType = "bybit" | "binance" | "kraken" | "coinbase";

export interface Exchange {
	id: string;
	name: string;
	type: ExchangeType;
	displayName: string;
	logoUrl?: string;
	isActive: boolean;
}

// Configuración de exchanges soportados
export const SUPPORTED_EXCHANGES: Record<ExchangeType, Exchange> = {
	bybit: {
		id: "bybit",
		name: "bybit",
		type: "bybit",
		displayName: "Bybit",
		isActive: true,
	},
	// Preparado para futuros exchanges
	binance: {
		id: "binance",
		name: "binance",
		type: "binance",
		displayName: "Binance",
		isActive: false,
	},
	kraken: {
		id: "kraken",
		name: "kraken",
		type: "kraken",
		displayName: "Kraken",
		isActive: false,
	},
	coinbase: {
		id: "coinbase",
		name: "coinbase",
		type: "coinbase",
		displayName: "Coinbase",
		isActive: false,
	},
};
