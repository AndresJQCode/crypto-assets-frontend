import { useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useConnectors, useDisconnectConnector, useToggleConnector } from "../hooks";
import type { ConnectorInstance } from "../types";
import { BybitConnector } from "./BybitConnector";
import { ConnectorCard } from "./ConnectorCard";
import { ConnectorListSkeleton } from "./ConnectorSkeleton";

export const ConnectorList = () => {
	const { data: connectors, isLoading, error } = useConnectors();
	const toggleConnector = useToggleConnector();
	const disconnectConnector = useDisconnectConnector();

	const [bybitDialogOpen, setBybitDialogOpen] = useState(false);
	const [disconnectDialog, setDisconnectDialog] = useState<{
		open: boolean;
		connector: ConnectorInstance | null;
	}>({ open: false, connector: null });

	const handleConnect = (connector: ConnectorInstance) => {
		if (connector.type === "bybit") {
			setBybitDialogOpen(true);
		}
	};

	const handleToggle = (connector: ConnectorInstance, isEnabled: boolean) => {
		toggleConnector.mutate(
			{ id: connector.id, isEnabled },
			{
				onSuccess: () => {
					toast.success(isEnabled ? "Conector habilitado" : "Conector deshabilitado");
				},
				onError: (err) => {
					toast.error("Error al cambiar el estado del conector", {
						description: err.message,
					});
				},
			},
		);
	};

	const handleDisconnect = (connector: ConnectorInstance) => {
		setDisconnectDialog({ open: true, connector });
	};

	const confirmDisconnect = () => {
		if (!disconnectDialog.connector) return;

		disconnectConnector.mutate(disconnectDialog.connector.id, {
			onSuccess: () => {
				toast.success("Conector desconectado exitosamente");
				setDisconnectDialog({ open: false, connector: null });
			},
			onError: (err) => {
				toast.error("Error al desconectar", {
					description: err.message,
				});
			},
		});
	};

	if (isLoading) {
		return <ConnectorListSkeleton />;
	}

	if (error) {
		return (
			<div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
				<p className="text-destructive">Error al cargar los conectores</p>
				<p className="text-sm text-muted-foreground mt-1">{error.message}</p>
			</div>
		);
	}

	if (!connectors || connectors.length === 0) {
		return (
			<div className="rounded-lg border border-dashed p-12 text-center">
				<p className="text-muted-foreground">No hay conectores disponibles</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{connectors.map((connector) => (
					<ConnectorCard
						key={connector.id}
						connector={connector}
						onConnect={handleConnect}
						onToggle={handleToggle}
						onDisconnect={handleDisconnect}
						isLoading={toggleConnector.isPending || disconnectConnector.isPending}
					/>
				))}
			</div>

			<BybitConnector open={bybitDialogOpen} onOpenChange={setBybitDialogOpen} />

			<AlertDialog
				open={disconnectDialog.open}
				onOpenChange={(open) => setDisconnectDialog({ open, connector: open ? disconnectDialog.connector : null })}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Desconectar {disconnectDialog.connector?.name}?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción desconectará la integración. Podrás volver a conectarla en cualquier momento, pero se perderá
							la configuración actual.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDisconnect}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Desconectar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};
