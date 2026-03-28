// Página de detalle de orden con trazabilidad completa

import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDetailCard } from "../components/order-detail/OrderDetailCard";
import { OrderTimeline } from "../components/order-detail/OrderTimeline";
import { TradesTable } from "../components/order-detail/TradesTable";
import { useGetOrderById, useGetOrderEvents, useGetOrderTrades } from "../hooks";

export const OrderDetailPage = () => {
	const { orderId } = useParams({ from: "/_admin/digital-assets/orders/$orderId" });

	const orderQuery = useGetOrderById(orderId);
	const eventsQuery = useGetOrderEvents(orderId);
	const tradesQuery = useGetOrderTrades(orderId);

	if (orderQuery.isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<div className="text-muted-foreground">Cargando orden...</div>
			</div>
		);
	}

	if (orderQuery.error) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="sm" asChild>
						<Link to="/digital-assets/orders">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Volver
						</Link>
					</Button>
				</div>
				<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
					<p className="text-destructive">Error al cargar la orden</p>
					<p className="text-sm text-muted-foreground mt-1">{orderQuery.error.message}</p>
				</div>
			</div>
		);
	}

	const order = orderQuery.data;
	if (!order) return null;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/digital-assets/orders">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Volver
					</Link>
				</Button>
			</div>

			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
					<FileText className="w-5 h-5 text-primary" />
				</div>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Orden {order.exchangeOrderId || order.id}</h1>
					<p className="text-muted-foreground">Trazabilidad completa y detalle de la orden</p>
				</div>
			</div>

			{/* Main Content - 2 columns */}
			<div className="grid gap-6 lg:grid-cols-2">
				<OrderDetailCard order={order} />

				<div>
					<h2 className="text-xl font-semibold mb-4">Línea de Tiempo</h2>
					<OrderTimeline events={eventsQuery.data || []} isLoading={eventsQuery.isLoading} />
				</div>
			</div>

			{/* Trades Section */}
			{tradesQuery.data && tradesQuery.data.length > 0 && (
				<div>
					<h2 className="text-xl font-semibold mb-4">Ejecuciones (Trades/Fills)</h2>
					<TradesTable trades={tradesQuery.data} />
				</div>
			)}
		</div>
	);
};
