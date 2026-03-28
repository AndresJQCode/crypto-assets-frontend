// Página de órdenes con tabs para abiertas e historial

import { ListOrdered } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderFilters } from "../components/orders/OrderFilters";
import { OrdersTable } from "../components/orders/OrdersTable";
import { PnLTable } from "../components/orders/PnLTable";
import { useGetOrders } from "../hooks";
import type { OrderFilters as OrderFiltersType } from "../types";

export const OrdersWithTabsPage = () => {
	const [activeTab, setActiveTab] = useState<"open" | "closed" | "pnl">("open");
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [filters, setFilters] = useState<OrderFiltersType>({});

	// Combinar filtros con el status basado en el tab activo
	// Para el tab P&L, también queremos órdenes cerradas
	const combinedFilters: OrderFiltersType = {
		...filters,
		status: activeTab === "pnl" ? "closed" : activeTab,
	};

	const { data, isLoading, error } = useGetOrders(page, limit, combinedFilters);

	// Resetear página al cambiar de tab
	const handleTabChange = (value: string) => {
		setActiveTab(value as "open" | "closed" | "pnl");
		setPage(1);
		setFilters({}); // Limpiar filtros al cambiar de tab
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
					<ListOrdered className="w-5 h-5 text-primary" />
				</div>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Órdenes</h1>
					<p className="text-muted-foreground">Gestiona tus órdenes de trading</p>
				</div>
			</div>

			{/* Tabs */}
			<Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
				<TabsList>
					<TabsTrigger value="open">Órdenes Abiertas</TabsTrigger>
					<TabsTrigger value="closed">Historial de Órdenes</TabsTrigger>
					<TabsTrigger value="pnl">P&L</TabsTrigger>
				</TabsList>

				{/* Tab Content: Órdenes Abiertas */}
				<TabsContent value="open" className="space-y-6">
					<OrderFilters
						filters={filters}
						onFiltersChange={(newFilters) => {
							setFilters(newFilters);
							setPage(1); // Resetear página al cambiar filtros
						}}
					/>

					<OrdersTable
						data={data?.data}
						totalCount={data?.totalCount}
						page={page}
						limit={limit}
						onPageChange={setPage}
						isLoading={isLoading}
						error={error}
						variant="open"
					/>
				</TabsContent>

				{/* Tab Content: Historial de Órdenes */}
				<TabsContent value="closed" className="space-y-6">
					<OrderFilters
						filters={filters}
						onFiltersChange={(newFilters) => {
							setFilters(newFilters);
							setPage(1); // Resetear página al cambiar filtros
						}}
					/>

					<OrdersTable
						data={data?.data}
						totalCount={data?.totalCount}
						page={page}
						limit={limit}
						onPageChange={setPage}
						isLoading={isLoading}
						error={error}
						variant="closed"
					/>
				</TabsContent>

				{/* Tab Content: P&L */}
				<TabsContent value="pnl" className="space-y-6">
					<OrderFilters
						filters={filters}
						onFiltersChange={(newFilters) => {
							setFilters(newFilters);
							setPage(1); // Resetear página al cambiar filtros
						}}
					/>

					<PnLTable
						data={data?.data}
						totalCount={data?.totalCount}
						page={page}
						limit={limit}
						onPageChange={setPage}
						isLoading={isLoading}
						error={error}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
};
