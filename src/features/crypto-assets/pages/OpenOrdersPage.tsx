// Página de órdenes abiertas (activas)

import { Clock } from "lucide-react";
import { useState } from "react";
import { OrderFilters } from "../components/orders/OrderFilters";
import { OrdersTable } from "../components/orders/OrdersTable";
import { useGetOrders } from "../hooks";
import type { OrderFilters as OrderFiltersType } from "../types";

export const OpenOrdersPage = () => {
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [filters, setFilters] = useState<OrderFiltersType>({
		status: "open", // Filtro fijo para órdenes abiertas
	});

	const { data, isLoading, error } = useGetOrders(page, limit, filters);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
					<Clock className="w-5 h-5 text-blue-600" />
				</div>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Órdenes Abiertas</h1>
					<p className="text-muted-foreground">Órdenes activas en proceso de ejecución</p>
				</div>
			</div>

			{/* Filters */}
			<OrderFilters
				filters={filters}
				onFiltersChange={(newFilters) =>
					setFilters({
						...newFilters,
						status: "open", // Mantener el filtro de status en "open"
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
				variant="open"
			/>
		</div>
	);
};
