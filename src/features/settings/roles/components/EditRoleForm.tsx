import { Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRoleFormChanges } from "@/features/settings/shared/hooks";
import { useRoleById } from "../hooks";
import type { Role, UpdateRole } from "../types";
import { BaseRoleForm, type BaseRoleFormData } from "./BaseRoleForm";

interface EditRoleFormProps {
	roleId: string;
	onUpdateRole: (data: UpdateRole) => void;
	onCancel: () => void;
	isUpdatingRole?: boolean;
}

export const EditRoleForm: React.FC<EditRoleFormProps> = ({
	roleId,
	onUpdateRole,
	onCancel,
	isUpdatingRole = false,
}) => {
	const [originalRole, setOriginalRole] = useState<Role | null>(null);
	const [hasError, setHasError] = useState(false);
	const [formData, setFormData] = useState<BaseRoleFormData | null>(null);

	// Load role data
	const { data: role, isLoading: isLoadingRole, error: roleError } = useRoleById(roleId);

	// Update original role when data loads
	useEffect(() => {
		if (role) {
			setOriginalRole(role);
		}
	}, [role]);

	// Reset error state when update completes successfully
	useEffect(() => {
		if (!isUpdatingRole && originalRole && role) {
			setOriginalRole(role);
			setHasError(false);
		}
	}, [isUpdatingRole, originalRole, role]);

	// Detect pending changes
	const hasPendingChanges = useRoleFormChanges(
		originalRole,
		formData?.name || "",
		formData?.description,
		formData?.permissions || [],
	);

	const handleFormDataChange = (data: BaseRoleFormData) => {
		setFormData(data);
	};

	const handleSubmit = async (data: BaseRoleFormData) => {
		if (!role?.id || !originalRole) {
			return;
		}

		try {
			const updateData: UpdateRole = {
				id: role.id,
				name: data.name,
				description: data.description,
				permissionIds: data.permissions,
			};

			await onUpdateRole(updateData);
		} catch {
			setHasError(true);
		}
	};

	// Show loading state
	if (isLoadingRole) {
		return (
			<Card className="w-full max-w-2xl mx-auto">
				<CardContent className="flex items-center justify-center py-8">
					<div className="flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>Cargando datos del rol...</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Show error if role couldn't be loaded
	if (roleError) {
		return (
			<Card className="w-full max-w-2xl mx-auto">
				<CardContent className="flex flex-col items-center justify-center py-8">
					<p className="text-red-600 mb-4">Error al cargar el rol: {roleError.message}</p>
					<Button onClick={onCancel} variant="outline">
						Volver
					</Button>
				</CardContent>
			</Card>
		);
	}

	// If no role, don't show anything
	if (!role) {
		return null;
	}

	const initialData = {
		name: role.name,
		description: role.description,
		permissions: role.permissions.map((p) => p.id),
	};

	// Get submit button text based on state
	const getSubmitButtonText = () => {
		if (isUpdatingRole) return "Guardando...";
		if (hasError) return "Reintentar guardar";
		if (hasPendingChanges) return "Guardar cambios";
		return "Sin cambios";
	};

	return (
		<BaseRoleForm
			mode="edit"
			initialData={initialData}
			onSubmit={handleSubmit}
			onCancel={onCancel}
			onFormChange={handleFormDataChange}
			isLoading={isUpdatingRole || !hasPendingChanges}
			title={`Editar Rol: ${role.name}`}
			submitButtonText={getSubmitButtonText()}
			submitButtonIcon={isUpdatingRole ? Loader2 : Send}
			showPendingChanges={hasPendingChanges}
		/>
	);
};
