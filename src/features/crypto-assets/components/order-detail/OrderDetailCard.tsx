// Card con información principal de la orden

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order } from "../../types";
import { formatCryptoAmount, formatDate, formatUSD } from "../../utils/formatters";
import { ExchangeBadge } from "../shared/ExchangeBadge";
import { OrderStateBadge } from "../shared/OrderStateBadge";
import { TradingPairDisplay } from "../shared/TradingPairDisplay";

interface OrderDetailCardProps {
	order: Order;
}

export const OrderDetailCard = ({ order }: OrderDetailCardProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Información de la Orden</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-sm text-muted-foreground">Exchange</p>
						<ExchangeBadge exchangeId={order.exchangeId} className="mt-1" />
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Estado</p>
						<OrderStateBadge state={order.state} className="mt-1" />
					</div>
				</div>

				<div>
					<p className="text-sm text-muted-foreground">Par de Trading</p>
					<TradingPairDisplay pair={order.pair} className="text-lg mt-1" />
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="text-sm text-muted-foreground">Tipo</p>
						<p className="font-medium capitalize mt-1">{order.type}</p>
					</div>
					<div>
						<p className="text-sm text-muted-foreground">Lado</p>
						<p className={`font-medium mt-1 ${order.side === "buy" ? "text-green-600" : "text-red-600"}`}>
							{order.side === "buy" ? "Compra" : "Venta"}
						</p>
					</div>
				</div>

				<div className="border-t pt-4">
					<h4 className="font-semibold mb-3">Cantidades</h4>
					<div className="space-y-2">
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Total</span>
							<span className="font-mono">{formatCryptoAmount(order.quantity, order.pair.base, 4)}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Ejecutado</span>
							<span className="font-mono">{formatCryptoAmount(order.filledQuantity, order.pair.base, 4)}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Restante</span>
							<span className="font-mono">{formatCryptoAmount(order.remainingQuantity, order.pair.base, 4)}</span>
						</div>
					</div>
				</div>

				<div className="border-t pt-4">
					<h4 className="font-semibold mb-3">Precios</h4>
					<div className="space-y-2">
						{order.price && (
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Precio Límite</span>
								<span className="font-semibold">{formatUSD(order.price)}</span>
							</div>
						)}
						{order.averageFilledPrice && (
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Precio Promedio</span>
								<span className="font-semibold">{formatUSD(order.averageFilledPrice)}</span>
							</div>
						)}
						{order.totalValue && (
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Valor Total</span>
								<span className="font-semibold text-lg">{formatUSD(order.totalValue)}</span>
							</div>
						)}
					</div>
				</div>

				<div className="border-t pt-4">
					<h4 className="font-semibold mb-3">Fechas</h4>
					<div className="space-y-2">
						<div className="flex justify-between">
							<span className="text-sm text-muted-foreground">Creada</span>
							<span className="text-sm">{formatDate(order.createdAt)}</span>
						</div>
						{order.submittedAt && (
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Enviada</span>
								<span className="text-sm">{formatDate(order.submittedAt)}</span>
							</div>
						)}
						{order.completedAt && (
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Completada</span>
								<span className="text-sm">{formatDate(order.completedAt)}</span>
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
