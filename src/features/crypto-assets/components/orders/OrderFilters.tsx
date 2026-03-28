// Filtros para órdenes

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ORDER_STATES } from "../../constants/order-states";
import type { OrderFilters as OrderFiltersType } from "../../types";

interface OrderFiltersProps {
	filters: OrderFiltersType;
	onFiltersChange: (filters: OrderFiltersType) => void;
}

export const OrderFilters = ({ filters, onFiltersChange }: OrderFiltersProps) => {
	const handleClearFilters = () => {
		onFiltersChange({});
	};

	const hasActiveFilters = filters.state || filters.side || filters.type || filters.pair;

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="grid gap-4 md:grid-cols-4">
					<div className="space-y-2">
						<Label>Estado</Label>
						<Select
							value={filters.state || "all"}
							onValueChange={(value) =>
								onFiltersChange({
									...filters,
									state: value === "all" ? undefined : (value as OrderFiltersType["state"]),
								})
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Todos los estados" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos</SelectItem>
								{ORDER_STATES.map((state) => (
									<SelectItem key={state} value={state}>
										{state}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>Lado</Label>
						<Select
							value={filters.side || "all"}
							onValueChange={(value) =>
								onFiltersChange({
									...filters,
									side: value === "all" ? undefined : (value as OrderFiltersType["side"]),
								})
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Compra o Venta" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos</SelectItem>
								<SelectItem value="buy">Compra</SelectItem>
								<SelectItem value="sell">Venta</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>Tipo</Label>
						<Select
							value={filters.type || "all"}
							onValueChange={(value) =>
								onFiltersChange({
									...filters,
									type: value === "all" ? undefined : (value as OrderFiltersType["type"]),
								})
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Tipo de orden" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">Todos</SelectItem>
								<SelectItem value="market">Market</SelectItem>
								<SelectItem value="limit">Limit</SelectItem>
								<SelectItem value="stop_loss">Stop Loss</SelectItem>
								<SelectItem value="take_profit">Take Profit</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>Par</Label>
						<div className="flex gap-2">
							<Input
								placeholder="BTC/USDT"
								value={filters.pair || ""}
								onChange={(e) => onFiltersChange({ ...filters, pair: e.target.value || undefined })}
							/>
							{hasActiveFilters && (
								<Button variant="outline" size="icon" onClick={handleClearFilters} title="Limpiar filtros">
									<X className="h-4 w-4" />
								</Button>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
