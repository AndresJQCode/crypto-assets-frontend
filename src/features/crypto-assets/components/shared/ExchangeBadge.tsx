// Badge para mostrar el exchange

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ExchangeType } from "../../types";
import { SUPPORTED_EXCHANGES } from "../../types";

interface ExchangeBadgeProps {
	exchangeId: ExchangeType;
	className?: string;
}

export const ExchangeBadge = ({ exchangeId, className }: ExchangeBadgeProps) => {
	const exchange = SUPPORTED_EXCHANGES[exchangeId];

	return (
		<Badge variant="outline" className={cn("bg-slate-100 text-slate-800", className)}>
			{exchange.displayName}
		</Badge>
	);
};
