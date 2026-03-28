// Tabla de trades/fills (ejecuciones)

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Trade } from "../../types";
import { formatDate, formatUSD } from "../../utils/formatters";

interface TradesTableProps {
	trades: Trade[];
}

export const TradesTable = ({ trades }: TradesTableProps) => {
	if (!trades || trades.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Ejecuciones ({trades.length})</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID Trade</TableHead>
							<TableHead className="text-right">Cantidad</TableHead>
							<TableHead className="text-right">Precio</TableHead>
							<TableHead className="text-right">Valor</TableHead>
							<TableHead className="text-right">Fee</TableHead>
							<TableHead>Fecha</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{trades.map((trade) => (
							<TableRow key={trade.id}>
								<TableCell className="font-mono text-sm">{trade.exchangeTradeId || trade.id.slice(0, 8)}</TableCell>
								<TableCell className="text-right font-mono">{trade.executedQuantity.toFixed(4)}</TableCell>
								<TableCell className="text-right font-semibold">{formatUSD(trade.executedPrice)}</TableCell>
								<TableCell className="text-right font-semibold">{formatUSD(trade.executedValue)}</TableCell>
								<TableCell className="text-right text-sm text-muted-foreground">
									{trade.fee.toFixed(4)} {trade.feeCurrency}
								</TableCell>
								<TableCell className="text-sm text-muted-foreground">{formatDate(trade.timestamp)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};
