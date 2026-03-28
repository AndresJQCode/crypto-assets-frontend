// Página principal de activos (balances)

import { Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetList } from "../components/assets/AssetList";
import { DEFAULT_EXCHANGE } from "../constants/exchanges";
import { useGetAssetBalance } from "../hooks";
import { formatUSD } from "../utils/formatters";

export const AssetsPage = () => {
	const { data, isLoading, error } = useGetAssetBalance(DEFAULT_EXCHANGE);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
					<Coins className="w-5 h-5 text-primary" />
				</div>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Activos de Criptomonedas</h1>
					<p className="text-muted-foreground">Vista de balances y activos disponibles en Bybit</p>
				</div>
			</div>

			{/* KPI Cards */}
			{data && !isLoading && (
				<div className="grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Valor Total</CardTitle>
							<Coins className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{formatUSD(data.totalValueUSD)}</div>
							<p className="text-xs text-muted-foreground">En {data.assets.length} activos</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Activos Activos</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{data.assets.length}</div>
							<p className="text-xs text-muted-foreground">Criptomonedas</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Última Actualización</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-sm font-medium">{new Date(data.lastUpdated).toLocaleString("es-ES")}</div>
							<p className="text-xs text-muted-foreground">Hora local</p>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Assets List */}
			<AssetList data={data?.assets} isLoading={isLoading} error={error} />
		</div>
	);
};
