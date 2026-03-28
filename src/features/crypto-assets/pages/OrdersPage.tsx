// Página principal de órdenes de trading

import { ListOrdered } from "lucide-react";
import { useState } from "react";
import { OrderFilters } from "../components/orders/OrderFilters";
import { OrdersTable } from "../components/orders/OrdersTable";
import { useGetOrders } from "../hooks";
import type { OrderFilters as OrderFiltersType } from "../types";

export const OrdersPage = () => {
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [filters, setFilters] = useState<OrderFiltersType>({});

	const { data, isLoading, error } = useGetOrders(page, limit, filters);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
					<ListOrdered className="w-5 h-5 text-primary" />
				</div>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Órdenes</h1>
					<p className="text-muted-foreground">Historial y estado de órdenes de trading</p>
				</div>
			</div>

			{/* Filters */}
			<OrderFilters filters={filters} onFiltersChange={setFilters} />

			{/* Orders Table */}
			<OrdersTable
				data={data?.data}
				totalCount={data?.totalCount}
				page={page}
				limit={limit}
				onPageChange={setPage}
				isLoading={isLoading}
				error={error}
			/>
		</div>
	);
};
