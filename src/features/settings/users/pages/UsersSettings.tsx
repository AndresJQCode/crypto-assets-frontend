import { Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AddUserForm, EditUserForm, UserList } from "../components";
import { useCreateUser, useDeleteUser, useToggleUserStatus, useUpdateUser } from "../hooks";
import type { CreateUser, UpdateUser, User } from "../types";

export const UsersSettings: React.FC = () => {
	const [currentView, setCurrentView] = useState<"list" | "add" | "edit">("list");
	const [editingUserId, setEditingUserId] = useState<string | null>(null);
	const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

	// Hooks para operaciones CRUD
	const createUserMutation = useCreateUser();
	const updateUserMutation = useUpdateUser();
	const deleteUserMutation = useDeleteUser();
	const toggleUserStatusMutation = useToggleUserStatus();

	const handleAddUser = () => {
		setCurrentView("add");
	};

	const handleEditUser = (user: User) => {
		setEditingUserId(user.id);
		setCurrentView("edit");
	};

	const handleCancelAdd = () => {
		setCurrentView("list");
	};

	const handleCancelEdit = () => {
		setEditingUserId(null);
		setCurrentView("list");
	};

	const handleSubmitUser = (data: CreateUser) => {
		// Convertir CreateUserRequest a CreateUser para el servicio
		const userData = {
			name: data.name,
			email: data.email,
			roles: data.roles,
		};

		createUserMutation.mutate(userData, {
			onSuccess: () => {
				setCurrentView("list");
				toast.success("Usuario creado exitosamente");
			},
			onError: (error) => {
				toast.error("Error al crear usuario", {
					description: error.message || "Ha ocurrido un error al crear el usuario. Inténtalo de nuevo.",
				});
			},
		});
	};

	const handleUpdateUser = (data: UpdateUser) => {
		updateUserMutation.mutate(data, {
			onSuccess: () => {
				toast.success("Usuario actualizado exitosamente");
			},
			onError: (error) => {
				toast.error("Error al actualizar usuario", {
					description: error.message || "Ha ocurrido un error al actualizar el usuario. Inténtalo de nuevo.",
				});
			},
		});
	};

	const handleDeleteUser = (user: User) => {
		if (confirm(`¿Estás seguro de que deseas eliminar al usuario "${user.name}"?`)) {
			setDeletingUserId(user.id);
			deleteUserMutation.mutate(user.id, {
				onSuccess: () => {
					setDeletingUserId(null);
					toast.success("Usuario eliminado exitosamente");
				},
				onError: (error) => {
					setDeletingUserId(null);
					toast.error("Error al eliminar usuario", {
						description: error.message || "Ha ocurrido un error al eliminar el usuario. Inténtalo de nuevo.",
					});
				},
			});
		}
	};

	const handleToggleUserStatus = (user: User) => {
		toggleUserStatusMutation.mutate(
			{ id: user.id, isActive: !user.isActive },
			{
				onSuccess: () => {
					toast.success(`Usuario ${user.isActive ? "desactivado" : "activado"} exitosamente`);
				},
				onError: (error) => {
					toast.error("Error al cambiar el estado del usuario", {
						description: error.message || "Ha ocurrido un error al cambiar el estado del usuario. Inténtalo de nuevo.",
					});
				},
			},
		);
	};

	return (
		<>
			{/* Header del contenido */}
			<div className="p-6 border-b flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Users className="h-6 w-6 text-gray-600" />
					<h1 className="text-xl font-bold">Usuarios</h1>
				</div>
			</div>

			{/* Contenido dinámico */}
			<div className="p-6">
				{currentView === "list" ? (
					<div className="space-y-6">
						<UserList
							onAddUser={handleAddUser}
							onEditUser={handleEditUser}
							onDeleteUser={handleDeleteUser}
							onToggleUserStatus={handleToggleUserStatus}
							isDeletingUser={deleteUserMutation.isPending}
							deletingUserId={deletingUserId || undefined}
						/>
					</div>
				) : currentView === "add" ? (
					<AddUserForm
						onSubmit={handleSubmitUser}
						onCancel={handleCancelAdd}
						isLoading={createUserMutation.isPending}
					/>
				) : currentView === "edit" && editingUserId ? (
					<EditUserForm
						userId={editingUserId}
						onUpdateUser={handleUpdateUser}
						onCancel={handleCancelEdit}
						isUpdatingUser={updateUserMutation.isPending}
					/>
				) : null}
			</div>
		</>
	);
};
