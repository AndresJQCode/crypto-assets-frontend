import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConnectorDefinitions } from "../hooks";
import type { ConnectorDefinition } from "../types";
import { ConnectorDefinitionListItem } from "./ConnectorDefinitionListItem";
import { ConnectorDefinitionSkeleton } from "./ConnectorDefinitionSkeleton";

interface ConnectorDefinitionListProps {
	onAddConnector: () => void;
	onEditConnector: (connector: ConnectorDefinition) => void;
	onToggleConnector: (connector: ConnectorDefinition) => void;
	onDeleteConnector: (connector: ConnectorDefinition) => void;
}

export const ConnectorDefinitionList = ({
	onAddConnector,
	onEditConnector,
	onToggleConnector,
	onDeleteConnector,
}: ConnectorDefinitionListProps) => {
	const { data, isLoading, error, refetch } = useConnectorDefinitions(1, 100);

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Definiciones de Conectores</h2>
				</div>
				<div className="space-y-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<ConnectorDefinitionSkeleton key={`skeleton-${i}`} />
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold">Definiciones de Conectores</h2>
				</div>
				<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
					<p className="text-destructive">Error al cargar las definiciones de conectores</p>
					<p className="text-sm text-muted-foreground mt-1">{error.message}</p>
					<Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
						<RefreshCw className="mr-2 h-4 w-4" />
						Reintentar
					</Button>
				</div>
			</div>
		);
	}

	const connectors = data?.data || [];

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Definiciones de Conectores ({connectors.length})</h2>
				<Button onClick={onAddConnector} size="sm">
					<Plus className="mr-2 h-4 w-4" />
					Agregar Conector
				</Button>
			</div>

			{connectors.length === 0 ? (
				<div className="rounded-lg border border-dashed p-12 text-center">
					<p className="text-muted-foreground">No hay definiciones de conectores</p>
					<Button variant="outline" size="sm" className="mt-4" onClick={onAddConnector}>
						<Plus className="mr-2 h-4 w-4" />
						Agregar el primero
					</Button>
				</div>
			) : (
				<div className="space-y-3">
					{connectors.map((connector) => (
						<ConnectorDefinitionListItem
							key={connector.id}
							connector={connector}
							onEdit={onEditConnector}
							onToggle={onToggleConnector}
							onDelete={onDeleteConnector}
						/>
					))}
				</div>
			)}
		</div>
	);
};
