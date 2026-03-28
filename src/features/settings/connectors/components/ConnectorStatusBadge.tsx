import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ConnectorStatus } from "../types";

interface ConnectorStatusBadgeProps {
	status: ConnectorStatus;
	className?: string;
}

const statusConfig: Record<
	ConnectorStatus,
	{ label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
	not_configured: {
		label: "No configurado",
		variant: "outline",
		className: "text-muted-foreground",
	},
	configured_enabled: {
		label: "Conectado",
		variant: "default",
		className: "bg-green-600 hover:bg-green-600",
	},
	configured_disabled: {
		label: "Deshabilitado",
		variant: "secondary",
		className: "bg-yellow-100 text-yellow-800 border-yellow-200",
	},
	pending: {
		label: "Conectando...",
		variant: "outline",
		className: "animate-pulse",
	},
};

export const ConnectorStatusBadge = ({ status, className }: ConnectorStatusBadgeProps) => {
	const config = statusConfig[status];

	return (
		<Badge variant={config.variant} className={cn(config.className, className)}>
			{config.label}
		</Badge>
	);
};
