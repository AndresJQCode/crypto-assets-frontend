import { Send } from "lucide-react";
import { DESCRIPTIONS } from "@/features/settings/shared/utils/constants";
import type { CreateUser } from "../types";
import { BaseUserForm, type BaseUserFormData } from "./BaseUserForm";

interface AddUserFormProps {
	onSubmit: (data: CreateUser) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
	const handleSubmit = (data: BaseUserFormData) => {
		const userData: CreateUser = {
			name: data.name,
			email: data.email,
			roles: data.roles,
		};

		onSubmit(userData);
	};

	return (
		<BaseUserForm
			mode="create"
			onSubmit={handleSubmit}
			onCancel={onCancel}
			isLoading={isLoading}
			title="Agregar usuario"
			description={DESCRIPTIONS.ADD_USER}
			submitButtonText="Enviar invitación"
			submitButtonIcon={Send}
			submitButtonVariant="gray"
			showActiveToggle={false}
		/>
	);
};
