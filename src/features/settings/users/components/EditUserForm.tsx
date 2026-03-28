import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserFormChanges } from "@/features/settings/shared/hooks";
import { DESCRIPTIONS } from "@/features/settings/shared/utils/constants";
import { useGetUserById } from "../hooks";
import type { UpdateUser, User } from "../types";
import { BaseUserForm, type BaseUserFormData } from "./BaseUserForm";

interface EditUserFormProps {
	userId: string;
	onUpdateUser: (data: UpdateUser) => void;
	onCancel: () => void;
	isUpdatingUser?: boolean;
}

export const EditUserForm: React.FC<EditUserFormProps> = ({
	userId,
	onUpdateUser,
	onCancel,
	isUpdatingUser = false,
}) => {
	const [originalUser, setOriginalUser] = useState<User | null>(null);
	const [hasError, setHasError] = useState(false);
	const [formData, setFormData] = useState<BaseUserFormData | null>(null);

	// Load user data
	const { data: user, isLoading: isLoadingUser, error: userError } = useGetUserById(userId);

	// Update original user when data loads
	useEffect(() => {
		if (user) {
			setOriginalUser(user);
		}
	}, [user]);

	// Reset error state when update completes successfully
	useEffect(() => {
		if (!isUpdatingUser && originalUser && user) {
			setOriginalUser(user);
			setHasError(false);
		}
	}, [isUpdatingUser, originalUser, user]);

	// Detect pending changes
	const hasPendingChanges = useUserFormChanges(
		originalUser,
		formData?.name || "",
		formData?.email || "",
		formData?.isActive ?? false,
		formData?.roles || [],
	);

	const handleFormDataChange = (data: BaseUserFormData) => {
		setFormData(data);
	};

	const handleSubmit = async (data: BaseUserFormData) => {
		if (!user) return;

		try {
			const updateData: UpdateUser = {
				id: user.id,
				name: data.name,
				email: data.email,
				isActive: data.isActive,
				roleIds: data.roles,
			};

			await onUpdateUser(updateData);
		} catch {
			setHasError(true);
		}
	};

	// Show loading state
	if (isLoadingUser) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="sm" onClick={onCancel} className="flex items-center gap-2">
						<ArrowLeft className="h-4 w-4" />
						Volver
					</Button>
					<div>
						<h2 className="text-xl font-semibold">Editar usuario</h2>
						<p className="text-sm text-gray-600">Cargando datos...</p>
					</div>
				</div>
				<div className="flex items-center justify-center py-8">
					<div className="flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span className="text-sm text-gray-600">Cargando información del usuario...</span>
					</div>
				</div>
			</div>
		);
	}

	// Show error if user couldn't be loaded
	if (userError || !user) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="sm" onClick={onCancel} className="flex items-center gap-2">
						<ArrowLeft className="h-4 w-4" />
						Volver
					</Button>
					<div>
						<h2 className="text-xl font-semibold">Editar usuario</h2>
						<p className="text-sm text-red-600">Error al cargar los datos</p>
					</div>
				</div>
				<div className="flex items-center justify-center py-8">
					<div className="text-center">
						<p className="text-sm text-red-600 mb-4">
							{userError?.message || "No se pudo cargar la información del usuario"}
						</p>
						<Button variant="outline" onClick={onCancel}>
							Volver a la lista
						</Button>
					</div>
				</div>
			</div>
		);
	}

	const initialData = {
		name: user.name,
		email: user.email,
		isActive: user.isActive,
		roles: user.roles.map((role) => role.id),
	};

	// Additional content for progress and error indicators
	const additionalContent = (
		<>
			{/* Header with pending changes indicator */}
			{hasPendingChanges && (
				<div className="flex items-center gap-2 -mt-4 mb-2">
					<span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full animate-pulse">
						Cambios pendientes
					</span>
				</div>
			)}

			{/* Progress indicator */}
			{isUpdatingUser && (
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<div className="flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
						<div className="text-sm text-yellow-800">Actualizando datos del usuario y roles...</div>
					</div>
				</div>
			)}

			{/* Error indicator */}
			{hasError && (
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<div className="flex items-center gap-2">
						<div className="text-sm text-red-800">Error al guardar los cambios. Por favor, inténtalo de nuevo.</div>
					</div>
				</div>
			)}
		</>
	);

	// Custom submit button text based on state
	const getSubmitButtonText = () => {
		if (isUpdatingUser) return "Guardando...";
		if (hasError) return "Reintentar guardar";
		if (hasPendingChanges) return "Guardar cambios";
		return "Sin cambios";
	};

	// Custom submit button variant based on state
	const getSubmitButtonVariant = (): "default" | "blue" | "gray" => {
		if (hasError) return "default"; // Will use red in custom styling
		if (hasPendingChanges) return "blue";
		return "default";
	};

	return (
		<BaseUserForm
			mode="edit"
			initialData={initialData}
			onSubmit={handleSubmit}
			onCancel={onCancel}
			onFormChange={handleFormDataChange}
			isLoading={isUpdatingUser || !hasPendingChanges}
			title="Editar usuario"
			description={DESCRIPTIONS.EDIT_USER}
			submitButtonText={getSubmitButtonText()}
			submitButtonIcon={isUpdatingUser ? Loader2 : Save}
			submitButtonVariant={getSubmitButtonVariant()}
			showActiveToggle={true}
			emailWarning={DESCRIPTIONS.EMAIL_CHANGE_WARNING}
			additionalContent={additionalContent}
		/>
	);
};
