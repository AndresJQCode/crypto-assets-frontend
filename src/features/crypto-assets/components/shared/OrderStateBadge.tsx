// Badge para mostrar el estado de una orden con colores

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ORDER_STATE_COLORS, ORDER_STATE_LABELS } from "../../constants/order-states";
import type { OrderState } from "../../types";

interface OrderStateBadgeProps {
	state: OrderState;
	className?: string;
}

export const OrderStateBadge = ({ state, className }: OrderStateBadgeProps) => {
	return (
		<Badge variant="outline" className={cn(ORDER_STATE_COLORS[state], className)}>
			{ORDER_STATE_LABELS[state]}
		</Badge>
	);
};
