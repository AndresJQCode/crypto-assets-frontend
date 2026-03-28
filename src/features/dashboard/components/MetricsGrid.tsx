import { memo } from "react";
import type { DashboardMetric } from "../types";
import { MetricCard } from "./MetricCard";

interface MetricsGridProps {
	metrics: DashboardMetric[];
}

export const MetricsGrid = memo(function MetricsGrid({ metrics }: MetricsGridProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{metrics.map((metric, index) => (
				<MetricCard key={`${metric.name}-${index}`} metric={metric} />
			))}
		</div>
	);
});
