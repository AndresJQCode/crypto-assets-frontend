import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MetricsGrid } from "../components";
import { useDashboardMetrics } from "../hooks";

export const DashboardPage = () => {
	const { data: metrics, isLoading: metricsLoading, error, refetch } = useDashboardMetrics();

	if (metricsLoading) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">Bienvenido al panel de administración</p>
				</div>
				<div className="flex items-center justify-center h-64">
					<div className="text-muted-foreground">Cargando métricas de dashboard...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				</div>
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error al cargar métricas</AlertTitle>
					<AlertDescription className="flex items-center justify-between">
						<span>{error.message || "Ocurrió un error al obtener las métricas del dashboard."}</span>
						<Button variant="outline" size="sm" onClick={() => refetch()}>
							Reintentar
						</Button>
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
			</div>

			{metrics && <MetricsGrid metrics={metrics} />}
		</div>
	);
};
