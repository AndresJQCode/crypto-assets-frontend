// Configuración de estados de órdenes

import type { OrderState } from "../types";

export const ORDER_STATE_LABELS: Record<OrderState, string> = {
	Created: "Creada",
	Submitted: "Enviada",
	PartiallyFilled: "Parcialmente Ejecutada",
	Filled: "Ejecutada",
	Cancelled: "Cancelada",
	Rejected: "Rechazada",
};

export const ORDER_STATE_COLORS: Record<OrderState, string> = {
	Created: "bg-gray-100 text-gray-800",
	Submitted: "bg-blue-100 text-blue-800",
	PartiallyFilled: "bg-yellow-100 text-yellow-800",
	Filled: "bg-green-100 text-green-800",
	Cancelled: "bg-red-100 text-red-800",
	Rejected: "bg-red-100 text-red-800",
};

export const ORDER_STATES: OrderState[] = [
	"Created",
	"Submitted",
	"PartiallyFilled",
	"Filled",
	"Cancelled",
	"Rejected",
];
