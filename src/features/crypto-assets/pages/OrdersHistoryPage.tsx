// Página de historial de órdenes (cerradas)

import { History } from "lucide-react";
import { useState } from "react";
import { OrderFilters } from "../components/orders/OrderFilters";
import { OrdersTable } from "../components/orders/OrdersTable";
import { useGetOrders } from "../hooks";
import type { OrderFilters as OrderFiltersType } from "../types";

export const OrdersHistoryPage = () => {
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [filters, setFilters] = useState<OrderFiltersType>({
		status: "closed", // Filtro fijo para órdenes cerradas
	});

	const { data, isLoading, error } = useGetOrders(page, limit, filters);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-500/10">
					<History className="w-5 h-5 text-gray-600" />
				</div>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Historial de Órdenes</h1>
					<p className="text-muted-foreground">Órdenes finalizadas (ejecutadas, canceladas o rechazadas)</p>
				</div>
			</div>

			{/* Filters */}
			<OrderFilters
				filters={filters}
				onFiltersChange={(newFilters) =>
					setFilters({
						...newFilters,
						status: "closed", // Mantener el filtro de status en "closed"
					})
				}
			/>

			{/* Orders Table */}
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
		</div>
	);
};
