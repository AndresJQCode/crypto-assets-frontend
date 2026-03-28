// Datos mock de trades/fills (ejecuciones)

import type { Trade } from "../types";

export const mockOrderTrades: Record<string, Trade[]> = {
	"order-1": [
		{
			id: "trade-1-1",
			orderId: "order-1",
			exchangeTradeId: "bybit-trade-1001",
			executedQuantity: 0.25,
			executedPrice: 59950,
			executedValue: 14987.5,
			fee: 7.49,
			feeCurrency: "USDT",
			timestamp: "2026-02-05T08:10:00Z",
		},
		{
			id: "trade-1-2",
			orderId: "order-1",
			exchangeTradeId: "bybit-trade-1002",
			executedQuantity: 0.25,
			executedPrice: 59950,
			executedValue: 14987.5,
			fee: 7.49,
			feeCurrency: "USDT",
			timestamp: "2026-02-05T08:15:00Z",
		},
	],
	"order-2": [
		{
			id: "trade-2-1",
			orderId: "order-2",
			exchangeTradeId: "bybit-trade-1003",
			executedQuantity: 2.5,
			executedPrice: 2490,
			executedValue: 6225,
			fee: 3.11,
			feeCurrency: "USDT",
			timestamp: "2026-02-05T12:30:00Z",
		},
	],
	"order-3": [
		{
			id: "trade-3-1",
			orderId: "order-3",
			exchangeTradeId: "bybit-trade-1004",
			executedQuantity: 0.3,
			executedPrice: 60500,
			executedValue: 18150,
			fee: 9.08,
			feeCurrency: "USDT",
			timestamp: "2026-02-06T09:00:30Z",
		},
	],
	"order-5": [
		{
			id: "trade-5-1",
			orderId: "order-5",
			exchangeTradeId: "bybit-trade-1005",
			executedQuantity: 2.0,
			executedPrice: 2510,
			executedValue: 5020,
			fee: 2.51,
			feeCurrency: "USDT",
			timestamp: "2026-02-06T11:00:15Z",
		},
	],
	"order-8": [
		{
			id: "trade-8-1",
			orderId: "order-8",
			exchangeTradeId: "bybit-trade-1006",
			executedQuantity: 100,
			executedPrice: 150,
			executedValue: 15000,
			fee: 7.5,
			feeCurrency: "USDT",
			timestamp: "2026-02-03T10:00:10Z",
		},
	],
	"order-10": [
		{
			id: "trade-10-1",
			orderId: "order-10",
			exchangeTradeId: "bybit-trade-1007",
			executedQuantity: 500,
			executedPrice: 0.7,
			executedValue: 350,
			fee: 0.18,
			feeCurrency: "USDT",
			timestamp: "2026-02-05T18:00:00Z",
		},
	],
};
