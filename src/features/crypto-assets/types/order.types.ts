// Tipos para Órdenes de trading

import type { ExchangeType } from "./exchange.types";

export type OrderState = "Created" | "Submitted" | "PartiallyFilled" | "Filled" | "Cancelled" | "Rejected";

// Status de la orden: abierta (activa) o cerrada (finalizada)
export type OrderStatus = "open" | "closed";

export type OrderType = "market" | "limit" | "stop_loss" | "take_profit";
export type OrderSide = "buy" | "sell";

export interface TradingPair {
	base: string; // BTC
	quote: string; // USDT
	symbol: string; // BTC/USDT
}

export interface Order {
	id: string;
	exchangeId: ExchangeType;
	exchangeOrderId?: string; // ID en el exchange (Bybit, etc)
	pair: TradingPair;
	type: OrderType;
	side: OrderSide;
	state: OrderState;
	quantity: number;
	filledQuantity: number;
	remainingQuantity: number;
	price?: number; // Para limit orders
	averageFilledPrice?: number;
	totalValue?: number;
	currentPrice?: number; // Precio de mercado actual
	pnl?: number; // Profit and Loss (ganancia/pérdida)
	pnlPercentage?: number; // PnL en porcentaje
	createdAt: string;
	updatedAt: string;
	submittedAt?: string;
	completedAt?: string;
	metadata?: Record<string, unknown>;
}

// Filtros para búsqueda de órdenes
export interface OrderFilters {
	exchangeId?: ExchangeType;
	status?: OrderStatus; // Filtro por status: open o closed
	state?: OrderState;
	side?: OrderSide;
	type?: OrderType;
	pair?: string;
	dateFrom?: string;
	dateTo?: string;
}

// Helper para determinar el status de una orden basado en su estado
export const getOrderStatus = (state: OrderState): OrderStatus => {
	// Estados abiertos: Created, Submitted, PartiallyFilled
	if (state === "Created" || state === "Submitted" || state === "PartiallyFilled") {
		return "open";
	}
	// Estados cerrados: Filled, Cancelled, Rejected
	return "closed";
};
