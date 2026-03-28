// Componente de resumen de PnL (Profit and Loss)

import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatUSD } from "../../utils/formatters";

interface PnLMetrics {
	totalPnL: number;
	realizedPnL: number;
	unrealizedPnL: number;
	winRate: number;
	totalTrades: number;
}

interface PnLSummaryProps {
	metrics: PnLMetrics;
	isLoading?: boolean;
}

export const PnLSummary = ({ metrics, isLoading }: PnLSummaryProps) => {
	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<Card key={i}>
						<CardHeader>
							<div className="h-4 w-24 bg-muted animate-pulse rounded" />
						</CardHeader>
						<CardContent>
							<div className="h-8 w-32 bg-muted animate-pulse rounded" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	const totalIsPositive = metrics.totalPnL >= 0;
	const realizedIsPositive = metrics.realizedPnL >= 0;
	const unrealizedIsPositive = metrics.unrealizedPnL >= 0;

	return (
		<div className="space-y-6">
			{/* Métricas principales */}
			<div className="grid gap-4 md:grid-cols-3">
				{/* PnL Total */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">PnL Total</CardTitle>
						<Wallet className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className={`text-2xl font-bold ${totalIsPositive ? "text-green-600" : "text-red-600"}`}>
							{totalIsPositive ? "+" : ""}
							{formatUSD(metrics.totalPnL)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">{metrics.totalTrades} operaciones totales</p>
					</CardContent>
				</Card>

				{/* PnL Realizado */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">PnL Realizado</CardTitle>
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className={`text-2xl font-bold ${realizedIsPositive ? "text-green-600" : "text-red-600"}`}>
							{realizedIsPositive ? "+" : ""}
							{formatUSD(metrics.realizedPnL)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">De órdenes cerradas</p>
					</CardContent>
				</Card>

				{/* PnL No Realizado */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">PnL No Realizado</CardTitle>
						<TrendingDown className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className={`text-2xl font-bold ${unrealizedIsPositive ? "text-green-600" : "text-red-600"}`}>
							{unrealizedIsPositive ? "+" : ""}
							{formatUSD(metrics.unrealizedPnL)}
						</div>
						<p className="text-xs text-muted-foreground mt-1">De órdenes abiertas</p>
					</CardContent>
				</Card>
			</div>

			{/* Estadísticas adicionales */}
			<Card>
				<CardHeader>
					<CardTitle>Estadísticas</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Tasa de Éxito</span>
							<span className="text-sm font-medium">{metrics.winRate.toFixed(1)}%</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Total de Operaciones</span>
							<span className="text-sm font-medium">{metrics.totalTrades}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
