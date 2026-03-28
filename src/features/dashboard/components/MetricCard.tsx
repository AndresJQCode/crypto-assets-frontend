import { Activity, UserCheck, Users, UserX } from "lucide-react";
import { memo } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardMetric } from "../types";

interface MetricCardProps {
	metric: DashboardMetric;
}

// Mapeo de colores a clases CSS de Tailwind
const colorClassMap: Record<string, string> = {
	blue: "text-blue-600",
	green: "text-green-600",
	red: "text-red-600",
	yellow: "text-yellow-600",
	purple: "text-purple-600",
	orange: "text-orange-600",
	gray: "text-gray-600",
};

const getColorClass = (color: string): string => {
	return colorClassMap[color] || "text-gray-600";
};

// Función extraída fuera del componente para evitar recreación en cada render
const getMetricIcon = (icon: string, color: string) => {
	const colorClass = getColorClass(color);
	switch (icon) {
		case "Users":
			return <Users className="h-6 w-6 text-blue-600" />;
		case "UserCheck":
			return <UserCheck className={cn("h-6 w-6", colorClass)} />;
		case "UserX":
			return <UserX className={cn("h-6 w-6", colorClass)} />;
		default:
			return <Activity className={cn("h-6 w-6", colorClass)} />;
	}
};

export const MetricCard = memo(function MetricCard({ metric }: MetricCardProps) {
	return (
		<Card className="relative overflow-hidden gap-0">
			<CardContent className="relative z-10 pt-0">
				<div className="flex items-center space-x-2">
					<div className="p-1.5 rounded-md bg-gray-100/50 dark:bg-gray-800/50">
						{getMetricIcon(metric.icon ?? "", metric.color)}
					</div>
					<CardTitle className="text-md font-semibold text-gray-700 dark:text-gray-300">
						{metric.name} <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{metric.value}</div>
					</CardTitle>
				</div>
			</CardContent>
		</Card>
	);
});
