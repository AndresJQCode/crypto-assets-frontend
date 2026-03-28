// Lista de activos (tabla)

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Asset } from "../../types";
import { formatCryptoAmount, formatUSD } from "../../utils/formatters";
import { AssetSkeleton } from "./AssetSkeleton";

interface AssetListProps {
	data?: Asset[];
	isLoading: boolean;
	error: Error | null;
}

export const AssetList = ({ data, isLoading, error }: AssetListProps) => {
	if (isLoading) {
		return <AssetSkeleton />;
	}

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Activos</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
						<p className="text-destructive">Error al cargar los activos</p>
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
					<CardTitle>Activos</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="rounded-lg border border-dashed p-12 text-center">
						<p className="text-muted-foreground">No hay activos disponibles</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Activos ({data.length})</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Símbolo</TableHead>
							<TableHead>Nombre</TableHead>
							<TableHead className="text-right">Total</TableHead>
							<TableHead className="text-right">Disponible</TableHead>
							<TableHead className="text-right">Bloqueado</TableHead>
							<TableHead className="text-right">Valor USD</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((asset) => (
							<TableRow key={asset.id}>
								<TableCell className="font-mono font-semibold">{asset.symbol}</TableCell>
								<TableCell className="text-muted-foreground">{asset.name}</TableCell>
								<TableCell className="text-right font-medium">
									{formatCryptoAmount(asset.totalQuantity, asset.symbol, 4)}
								</TableCell>
								<TableCell className="text-right">
									{formatCryptoAmount(asset.availableQuantity, asset.symbol, 4)}
								</TableCell>
								<TableCell className="text-right">
									{formatCryptoAmount(asset.lockedQuantity, asset.symbol, 4)}
								</TableCell>
								<TableCell className="text-right font-semibold">
									{asset.estimatedValueUSD ? formatUSD(asset.estimatedValueUSD) : "-"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};
