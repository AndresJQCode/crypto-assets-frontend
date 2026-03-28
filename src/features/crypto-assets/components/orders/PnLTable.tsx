// Tabla de P&L (Profit & Loss) para órdenes cerradas

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ExternalLink, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Order } from "../../types";
import { formatDate } from "../../utils/formatters";
import { OrderSkeleton } from "./OrderSkeleton";

interface PnLTableProps {
	data?: Order[];
	totalCount?: number;
	page: number;
	limit: number;
	onPageChange: (page: number) => void;
	isLoading: boolean;
	error: Error | null;
}

export const PnLTable = ({ data, totalCount = 0, page, limit, onPageChange, isLoading, error }: PnLTableProps) => {
	const columns = useMemo<ColumnDef<Order>[]>(
		() => [
			{
				accessorKey: "pair",
				header: "Market",
				cell: ({ row }) => (
					<div className="font-medium">
						{row.original.pair.base}
						<span className="text-muted-foreground">{row.original.pair.quote}</span>
					</div>
				),
			},
			{
				accessorKey: "entryPrice",
				header: "Entry Price",
				cell: ({ row }) => {
					const entryPrice = row.original.averageFilledPrice || row.original.price;
					return <span className="font-mono text-sm">{entryPrice ? entryPrice.toFixed(5) : "-"}</span>;
				},
			},
			{
				accessorKey: "tradedPrice",
				header: "Traded Price",
				cell: ({ row }) => {
					const tradedPrice = row.original.averageFilledPrice || row.original.price;
					return <span className="font-mono text-sm">{tradedPrice ? tradedPrice.toFixed(5) : "-"}</span>;
				},
			},
			{
				accessorKey: "quantity",
				header: "Order Quantity",
				cell: ({ row }) => {
					const quantity = row.original.filledQuantity;
					const asset = row.original.pair.base;
					return (
						<span className="font-mono text-sm">
							{quantity.toFixed(4)} {asset}
						</span>
					);
				},
			},
			{
				accessorKey: "type",
				header: "Trade Type",
				cell: ({ row }) => <span className="capitalize">{row.original.type}</span>,
			},
			{
				accessorKey: "realizedPnL",
				header: "Realized P&L",
				cell: ({ row }) => {
					const pnl = row.original.pnl || 0;
					const isPositive = pnl >= 0;

					return (
						<div className="flex items-center gap-2">
							<span className={`font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
								{pnl.toFixed(4)}
							</span>
							<button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
								<ExternalLink className="h-3 w-3" />
							</button>
						</div>
					);
				},
			},
			{
				accessorKey: "openingFee",
				header: "Opening Fee",
				cell: ({ row }) => {
					// Calcular fee aproximado (0.1% del valor de entrada)
					const entryPrice = row.original.averageFilledPrice || row.original.price || 0;
					const quantity = row.original.filledQuantity;
					const fee = entryPrice * quantity * 0.001;
					return <span className="font-mono text-sm">{fee.toFixed(8)} USDT</span>;
				},
			},
			{
				accessorKey: "closingFee",
				header: "Closing Fee",
				cell: ({ row }) => {
					// Calcular fee aproximado (0.1% del valor de salida)
					const exitPrice = row.original.averageFilledPrice || row.original.price || 0;
					const quantity = row.original.filledQuantity;
					const fee = exitPrice * quantity * 0.001;
					return <span className="font-mono text-sm">{fee.toFixed(8)} USDT</span>;
				},
			},
			{
				accessorKey: "fundingFee",
				header: "Funding Fee",
				cell: ({ row }) => {
					// Por ahora mostrar 0, esto debería venir del backend
					const fundingFee = row.original.metadata?.fundingFee || 0;
					return <span className="font-mono text-sm">{Number(fundingFee).toFixed(8)}</span>;
				},
			},
			{
				accessorKey: "tradeTime",
				header: "Trade Time",
				cell: ({ row }) => {
					const tradeTime = row.original.completedAt || row.original.updatedAt;
					return <span className="text-sm text-muted-foreground">{formatDate(tradeTime)}</span>;
				},
			},
		],
		[],
	);

	const table = useReactTable({
		data: data ?? [],
		columns,
		pageCount: Math.ceil(totalCount / limit),
		state: {
			pagination: {
				pageIndex: page - 1,
				pageSize: limit,
			},
		},
		onPaginationChange: (updater) => {
			if (typeof updater === "function") {
				const newState = updater({ pageIndex: page - 1, pageSize: limit });
				onPageChange(newState.pageIndex + 1);
			}
		},
		manualPagination: true,
		getCoreRowModel: getCoreRowModel(),
	});

	if (isLoading) {
		return <OrderSkeleton />;
	}

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>P&L</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
						<p className="text-destructive">Error al cargar los datos de P&L</p>
						<p className="text-sm text-muted-foreground mt-1">{error.message}</p>
						<Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
							<RefreshCw className="mr-2 h-4 w-4" />
							Reintentar
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!data || data.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>P&L</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-lg border border-dashed p-12 text-center">
						<p className="text-muted-foreground">No hay datos de P&L disponibles</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>P&L ({totalCount})</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border overflow-x-auto">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									))}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows.map((row) => (
								<TableRow key={row.id}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-between">
				<div className="text-sm text-muted-foreground">
					Mostrando {(page - 1) * limit + 1} a {Math.min(page * limit, totalCount)} de {totalCount} registros
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
						Anterior
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => onPageChange(page + 1)}
						disabled={page * limit >= totalCount}
					>
						Siguiente
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
};
