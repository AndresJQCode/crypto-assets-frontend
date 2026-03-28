import { Plug } from "lucide-react";
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
import {
	AddConnectorDefinitionForm,
	type ConnectorDefinitionFormData,
	ConnectorDefinitionList,
	EditConnectorDefinitionForm,
} from "../components";
import {
	useCreateConnectorDefinition,
	useDeleteConnectorDefinition,
	useToggleConnectorDefinition,
	useUpdateConnectorDefinition,
} from "../hooks";
import type { ConnectorDefinition } from "../types";

type ViewState = "list" | "add" | "edit";

export const ConnectorsAdminPage = () => {
	const [currentView, setCurrentView] = useState<ViewState>("list");
	const [editingConnector, setEditingConnector] = useState<ConnectorDefinition | null>(null);
	const [deleteDialog, setDeleteDialog] = useState<{
		open: boolean;
		connector: ConnectorDefinition | null;
	}>({ open: false, connector: null });

	const createMutation = useCreateConnectorDefinition();
	const updateMutation = useUpdateConnectorDefinition();
	const deleteMutation = useDeleteConnectorDefinition();
	const toggleMutation = useToggleConnectorDefinition();

	const handleAddConnector = () => {
		setCurrentView("add");
	};

	const handleEditConnector = (connector: ConnectorDefinition) => {
		setEditingConnector(connector);
		setCurrentView("edit");
	};

	const handleToggleConnector = (connector: ConnectorDefinition) => {
		toggleMutation.mutate(
			{ id: connector.id, isActive: !connector.isActive },
			{
				onSuccess: () => {
					toast.success(connector.isActive ? "Conector desactivado" : "Conector activado");
				},
				onError: (error) => {
					toast.error("Error al cambiar el estado", {
						description: error.message,
					});
				},
			},
		);
	};

	const handleDeleteConnector = (connector: ConnectorDefinition) => {
		setDeleteDialog({ open: true, connector });
	};

	const confirmDelete = () => {
		if (!deleteDialog.connector) return;

		deleteMutation.mutate(deleteDialog.connector.id, {
			onSuccess: () => {
				toast.success("Conector eliminado exitosamente");
				setDeleteDialog({ open: false, connector: null });
			},
			onError: (error) => {
				toast.error("Error al eliminar el conector", {
					description: error.message,
				});
			},
		});
	};

	const handleCreateSubmit = (data: ConnectorDefinitionFormData) => {
		createMutation.mutate(data, {
			onSuccess: () => {
				toast.success("Conector creado exitosamente");
				setCurrentView("list");
			},
			onError: (error) => {
				toast.error("Error al crear el conector", {
					description: error.message,
				});
			},
		});
	};

	const handleUpdateSubmit = (data: ConnectorDefinitionFormData) => {
		if (!editingConnector) return;

		updateMutation.mutate(
			{ id: editingConnector.id, ...data },
			{
				onSuccess: () => {
					toast.success("Conector actualizado exitosamente");
					setCurrentView("list");
					setEditingConnector(null);
				},
				onError: (error) => {
					toast.error("Error al actualizar el conector", {
						description: error.message,
					});
				},
			},
		);
	};

	const handleCancel = () => {
		setCurrentView("list");
		setEditingConnector(null);
	};

	return (
		<div className="space-y-6">
			{currentView === "list" && (
				<>
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
							<Plug className="w-5 h-5 text-primary" />
						</div>
						<div>
							<h1 className="text-3xl font-bold tracking-tight">Gestión de Conectores</h1>
							<p className="text-muted-foreground">
								Administra las definiciones de conectores disponibles para los tenants
							</p>
						</div>
					</div>

					<ConnectorDefinitionList
						onAddConnector={handleAddConnector}
						onEditConnector={handleEditConnector}
						onToggleConnector={handleToggleConnector}
						onDeleteConnector={handleDeleteConnector}
					/>
				</>
			)}

			{currentView === "add" && (
				<AddConnectorDefinitionForm
					onSubmit={handleCreateSubmit}
					onCancel={handleCancel}
					isLoading={createMutation.isPending}
				/>
			)}

			{currentView === "edit" && editingConnector && (
				<EditConnectorDefinitionForm
					connector={editingConnector}
					onSubmit={handleUpdateSubmit}
					onCancel={handleCancel}
					isLoading={updateMutation.isPending}
				/>
			)}

			<AlertDialog
				open={deleteDialog.open}
				onOpenChange={(open) => setDeleteDialog({ open, connector: open ? deleteDialog.connector : null })}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Eliminar {deleteDialog.connector?.name}?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción eliminará permanentemente la definición del conector. Los tenants que lo tengan configurado
							perderán la conexión.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Eliminar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};
