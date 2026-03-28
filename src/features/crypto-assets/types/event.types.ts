// Tipos para Eventos de Órdenes (Trazabilidad)

import type { OrderState } from "./order.types";

export type OrderEventType =
	| "order_created"
	| "order_submitted"
	| "order_partially_filled"
	| "order_filled"
	| "order_cancelled"
	| "order_rejected"
	| "state_changed";

export interface OrderEvent {
	id: string;
	orderId: string;
	type: OrderEventType;
	state: OrderState;
	timestamp: string;
	description: string;
	metadata?: {
		previousState?: OrderState;
		filledQuantity?: number;
		price?: number;
		reason?: string;
		[key: string]: unknown;
	};
}
