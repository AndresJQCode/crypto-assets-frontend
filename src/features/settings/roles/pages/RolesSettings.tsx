import { Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddRoleForm, EditRoleForm, RoleList } from "../components";
import { useCreateRole, useDeleteRole, useUpdateRole } from "../hooks";
import type { CreateRoleWithPermissions, Role, UpdateRole } from "../types";

export const RolesSettings: React.FC = () => {
	const [currentView, setCurrentView] = useState<"list" | "add" | "edit">("list");
	const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
	const [hasChanges, setHasChanges] = useState(false);
	const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);

	// Hooks para operaciones CRUD
	const createRoleMutation = useCreateRole();
	const updateRoleMutation = useUpdateRole();
	const deleteRoleMutation = useDeleteRole();

	const handleAddRole = () => {
		setCurrentView("add");
	};

	const handleCancelAdd = () => {
		setCurrentView("list");
	};

	const handleCreateRole = (data: CreateRoleWithPermissions) => {
		console.log("data", data);
		createRoleMutation.mutate(data, {
			onSuccess: () => {
				toast.success("Rol creado exitosamente");
				setCurrentView("list");
			},
			onError: (error) => {
				toast.error("Error al crear el rol", {
					description: error.message || "Ha ocurrido un error al crear el rol. Inténtalo de nuevo.",
				});
			},
		});
	};

	const handleCancelEdit = () => {
		setCurrentView("list");
		setSelectedRoleId(null);
		setHasChanges(false);
	};

	const handleEditRole = (role: Role) => {
		setSelectedRoleId(role.id);
		setCurrentView("edit");
	};

	const handleUpdateRole = (data: UpdateRole) => {
		updateRoleMutation.mutate(data, {
			onSuccess: () => {
				toast.success("Rol actualizado exitosamente");
			},
			onError: (error) => {
				toast.error("Error al actualizar rol", {
					description: error.message || "Ha ocurrido un error al actualizar el rol. Inténtalo de nuevo.",
				});
			},
		});
	};

	const handleDeleteRole = (role: Role) => {
		if (window.confirm(`¿Estás seguro de que quieres eliminar el rol "${role.name}"?`)) {
			setDeletingRoleId(role.id);
			deleteRoleMutation.mutate(role.id, {
				onSuccess: () => {
					setDeletingRoleId(null);
					toast.success("Rol eliminado exitosamente");
				},
				onError: (error) => {
					setDeletingRoleId(null);
					toast.error("Error al eliminar rol", {
						description: error.message || "Ha ocurrido un error al eliminar el rol.",
					});
				},
			});
		}
	};

	return (
		<>
			{/* Header del contenido */}
			<div className="p-6 border-b flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Shield className="h-6 w-6 text-gray-600" />
					<h1 className="text-xl font-bold">Roles</h1>
					{hasChanges && (
						<span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Cambios pendientes</span>
					)}
				</div>
			</div>

			{/* Contenido dinámico */}
			<div className="p-6">
				{currentView === "list" ? (
					<div className="space-y-6">
						<RoleList
							onAddRole={handleAddRole}
							onEditRole={handleEditRole}
							onDeleteRole={handleDeleteRole}
							isDeletingRole={deleteRoleMutation.isPending}
							deletingRoleId={deletingRoleId || undefined}
						/>
					</div>
				) : currentView === "add" ? (
					<AddRoleForm
						onSubmit={handleCreateRole}
						onCancel={handleCancelAdd}
						isLoading={createRoleMutation.isPending}
					/>
				) : currentView === "edit" && selectedRoleId ? (
					<EditRoleForm
						roleId={selectedRoleId}
						onUpdateRole={handleUpdateRole}
						onCancel={handleCancelEdit}
						isUpdatingRole={updateRoleMutation.isPending}
					/>
				) : null}
			</div>
		</>
	);
};
