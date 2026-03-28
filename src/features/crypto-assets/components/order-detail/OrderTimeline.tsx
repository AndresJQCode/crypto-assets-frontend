// Timeline vertical de eventos de la orden

import { AlertCircle, CheckCircle, Circle, Send, TrendingUp, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { OrderEvent } from "../../types";
import { formatDate } from "../../utils/formatters";

interface OrderTimelineProps {
	events: OrderEvent[];
	isLoading: boolean;
}

const getEventIcon = (type: string) => {
	switch (type) {
		case "order_created":
			return <Circle className="h-4 w-4" />;
		case "order_submitted":
			return <Send className="h-4 w-4" />;
		case "order_partially_filled":
			return <TrendingUp className="h-4 w-4" />;
		case "order_filled":
			return <CheckCircle className="h-4 w-4" />;
		case "order_cancelled":
			return <XCircle className="h-4 w-4" />;
		case "order_rejected":
			return <AlertCircle className="h-4 w-4" />;
		default:
			return <Circle className="h-4 w-4" />;
	}
};

const getEventColor = (type: string) => {
	switch (type) {
		case "order_filled":
			return "text-green-600";
		case "order_partially_filled":
			return "text-yellow-600";
		case "order_cancelled":
		case "order_rejected":
			return "text-red-600";
		case "order_submitted":
			return "text-blue-600";
		default:
			return "text-gray-600";
	}
};

export const OrderTimeline = ({ events, isLoading }: OrderTimelineProps) => {
	if (isLoading) {
		return (
			<Card>
				<CardContent className="pt-6 space-y-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={`skeleton-${i}`} className="flex gap-3">
							<Skeleton className="h-8 w-8 rounded-full" />
							<div className="space-y-2 flex-1">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-3 w-3/4" />
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		);
	}

	if (!events || events.length === 0) {
		return (
			<Card>
				<CardContent className="pt-6">
					<p className="text-muted-foreground text-center">No hay eventos registrados</p>
				</CardContent>
			</Card>
		);
	}

	// Ordenar eventos por fecha (más reciente primero)
	const sortedEvents = [...events].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="relative space-y-4">
					{/* Línea vertical */}
					<div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

					{sortedEvents.map((event) => (
						<div key={event.id} className="relative flex gap-3">
							{/* Icono */}
							<div
								className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 ${getEventColor(event.type)}`}
							>
								{getEventIcon(event.type)}
							</div>

							{/* Contenido */}
							<div className="flex-1 pb-4">
								<div className="flex items-start justify-between gap-2">
									<div>
										<p className="font-medium">{event.description}</p>
										<p className="text-sm text-muted-foreground">{formatDate(event.timestamp)}</p>
									</div>
								</div>

								{/* Metadata */}
								{event.metadata && Object.keys(event.metadata).length > 0 && (
									<div className="mt-2 text-sm text-muted-foreground">
										{event.metadata.previousState && <p>Estado anterior: {event.metadata.previousState}</p>}
										{event.metadata.reason && <p className="italic">Razón: {event.metadata.reason}</p>}
									</div>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
