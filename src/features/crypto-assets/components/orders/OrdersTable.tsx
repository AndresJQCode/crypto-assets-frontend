// Tabla de órdenes con paginación

import { Link } from "@tanstack/react-router";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Order } from "../../types";
import { formatDate, formatUSD } from "../../utils/formatters";
import { OrderStateBadge } from "../shared/OrderStateBadge";
import { TradingPairDisplay } from "../shared/TradingPairDisplay";
import { OrderSkeleton } from "./OrderSkeleton";

interface OrdersTableProps {
	data?: Order[];
	totalCount?: number;
	page: number;
	limit: number;
	onPageChange: (page: number) => void;
	isLoading: boolean;
	error: Error | null;
	variant?: "open" | "closed" | "all"; // Tipo de vista: abiertas, cerradas o todas
}

export const OrdersTable = ({
	data,
	totalCount = 0,
	page,
	limit,
	onPageChange,
	isLoading,
	error,
	variant = "all",
}: OrdersTableProps) => {
	const columns = useMemo<ColumnDef<Order>[]>(() => {
		const baseColumns: ColumnDef<Order>[] = [
			{
				accessorKey: "exchangeOrderId",
				header: "ID",
				cell: ({ row }) => (
					<span className="font-mono text-sm">{row.original.exchangeOrderId || row.original.id.slice(0, 8)}</span>
				),
			},
			{
				accessorKey: "pair",
				header: "Par",
				cell: ({ row }) => <TradingPairDisplay pair={row.original.pair} />,
			},
			{
				accessorKey: "type",
				header: "Tipo",
				cell: ({ row }) => <span className="capitalize">{row.original.type}</span>,
			},
			{
				accessorKey: "side",
				header: "Lado",
				cell: ({ row }) => (
					<span className={row.original.side === "buy" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
						{row.original.side === "buy" ? "Compra" : "Venta"}
					</span>
				),
			},
		];

		// Columna de estado: solo para órdenes abiertas
		if (variant === "open") {
			baseColumns.push({
				accessorKey: "state",
				header: "Estado",
				cell: ({ row }) => <OrderStateBadge state={row.original.state} />,
			});
		}

		// Entry Price
		baseColumns.push({
			accessorKey: "entryPrice",
			header: "Entry Price",
			cell: ({ row }) => {
				const entryPrice = row.original.averageFilledPrice || row.original.price;
				return <span className="font-mono">{entryPrice ? formatUSD(entryPrice) : "-"}</span>;
			},
		});

		// PnL: solo para órdenes abiertas
		if (variant === "open") {
			baseColumns.push({
				accessorKey: "pnl",
				header: "PnL",
				cell: ({ row }) => {
					const pnl = row.original.pnl || 0;
					const pnlPercentage = row.original.pnlPercentage || 0;
					const isPositive = pnl >= 0;

					return (
						<div className="flex flex-col">
							<span className={`font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
								{isPositive ? "+" : ""}
								{formatUSD(pnl)}
							</span>
							<span className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
								{isPositive ? "+" : ""}
								{pnlPercentage.toFixed(2)}%
							</span>
						</div>
					);
				},
			});
		}

		// Cantidad: diferente según variant
		if (variant === "open") {
			// Para órdenes abiertas: Filled/Order Quantity
			baseColumns.push({
				accessorKey: "filledOrderQuantity",
				header: "Filled/Order Quantity",
				cell: ({ row }) => (
					<span className="font-mono">
						{row.original.filledQuantity.toFixed(4)}/{row.original.quantity.toFixed(4)}
					</span>
				),
			});
		} else {
			// Para órdenes cerradas: solo Cantidad
			baseColumns.push({
				accessorKey: "quantity",
				header: "Cantidad",
				cell: ({ row }) => <span className="font-mono">{row.original.quantity.toFixed(4)}</span>,
			});
		}

		// Valor y Fecha siempre presentes
		baseColumns.push(
			{
				accessorKey: "totalValue",
				header: "Valor",
				cell: ({ row }) => (
					<span className="font-semibold">{row.original.totalValue ? formatUSD(row.original.totalValue) : "-"}</span>
				),
			},
			{
				accessorKey: "createdAt",
				header: "Fecha",
				cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
			},
		);

		// Acciones: solo para historial de órdenes
		if (variant === "closed" || variant === "all") {
			baseColumns.push({
				id: "actions",
				cell: ({ row }) => (
					<Button variant="ghost" size="sm" asChild>
						<Link to="/digital-assets/orders/$orderId" params={{ orderId: row.original.id }}>
							Ver <ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				),
			});
		}

		return baseColumns;
	}, [variant]);

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
					<CardTitle>Órdenes</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
						<p className="text-destructive">Error al cargar las órdenes</p>
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
					<CardTitle>Órdenes</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-lg border border-dashed p-12 text-center">
						<p className="text-muted-foreground">No hay órdenes que coincidan con los filtros</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Órdenes ({totalCount})</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="rounded-md border">
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
					Mostrando {(page - 1) * limit + 1} a {Math.min(page * limit, totalCount)} de {totalCount} órdenes
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
