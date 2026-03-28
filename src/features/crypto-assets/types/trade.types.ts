// Tipos para Trades/Fills (Ejecuciones de órdenes)

export interface Trade {
	id: string;
	orderId: string;
	exchangeTradeId?: string; // ID del trade en el exchange
	executedQuantity: number;
	executedPrice: number;
	executedValue: number;
	fee: number;
	feeCurrency: string;
	timestamp: string;
	metadata?: Record<string, unknown>;
}
