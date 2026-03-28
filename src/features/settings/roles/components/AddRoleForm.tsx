import { Loader2, Send } from "lucide-react";
import type { CreateRoleWithPermissions } from "../types";
import { BaseRoleForm, type BaseRoleFormData } from "./BaseRoleForm";

interface AddRoleFormProps {
	onSubmit: (data: CreateRoleWithPermissions) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const AddRoleForm: React.FC<AddRoleFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
	const handleSubmit = (data: BaseRoleFormData) => {
		const roleData: CreateRoleWithPermissions = {
			name: data.name,
			description: data.description,
			permissionIds: data.permissions,
		};

		onSubmit(roleData);
	};

	return (
		<BaseRoleForm
			mode="create"
			onSubmit={handleSubmit}
			onCancel={onCancel}
			isLoading={isLoading}
			title="Crear Nuevo Rol"
			submitButtonText={isLoading ? "Creando..." : "Crear rol"}
			submitButtonIcon={isLoading ? Loader2 : Send}
		/>
	);
};
