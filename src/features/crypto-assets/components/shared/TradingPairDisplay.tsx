// Componente para mostrar pares de trading de forma consistente

import { cn } from "@/lib/utils";
import type { TradingPair } from "../../types";

interface TradingPairDisplayProps {
	pair: TradingPair;
	className?: string;
}

export const TradingPairDisplay = ({ pair, className }: TradingPairDisplayProps) => {
	return <span className={cn("font-mono font-semibold", className)}>{pair.symbol}</span>;
};
