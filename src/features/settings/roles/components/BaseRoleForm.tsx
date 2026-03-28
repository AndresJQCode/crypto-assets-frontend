import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PermissionSelector } from "@/features/settings/shared/components";
import { LABELS, PLACEHOLDERS } from "@/features/settings/shared/utils/constants";
import {
	idsArraySchema,
	nameWithMaxLengthSchema,
	optionalDescriptionSchema,
} from "@/features/settings/shared/utils/validation-schemas";

const baseRoleSchema = z.object({
	name: nameWithMaxLengthSchema(100),
	description: optionalDescriptionSchema(500),
	permissions: idsArraySchema(1, "Debe asignar al menos un permiso"),
});

export type BaseRoleFormData = z.infer<typeof baseRoleSchema>;

interface BaseRoleFormProps {
	mode: "create" | "edit";
	initialData?: {
		name?: string;
		description?: string;
		permissions?: string[];
	};
	onSubmit: (data: BaseRoleFormData) => void;
	onCancel: () => void;
	onFormChange?: (data: BaseRoleFormData) => void;
	isLoading?: boolean;
	title: string;
	submitButtonText: string;
	submitButtonIcon: LucideIcon;
	additionalContent?: React.ReactNode;
	showPendingChanges?: boolean;
}

export const BaseRoleForm: React.FC<BaseRoleFormProps> = ({
	mode: _mode,
	initialData,
	onSubmit,
	onCancel,
	onFormChange,
	isLoading = false,
	title,
	submitButtonText,
	submitButtonIcon: SubmitIcon,
	additionalContent,
	showPendingChanges = false,
}) => {
	const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(initialData?.permissions || []);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
		reset,
	} = useForm<BaseRoleFormData>({
		mode: "onChange",
		resolver: zodResolver(baseRoleSchema),
		defaultValues: {
			name: initialData?.name || "",
			description: initialData?.description || "",
			permissions: initialData?.permissions || [],
		},
	});

	const watchedName = watch("name");
	const watchedDescription = watch("description");

	// Update form when initialData changes (useful for edit mode)
	useEffect(() => {
		if (initialData) {
			reset({
				name: initialData.name || "",
				description: initialData.description || "",
				permissions: initialData.permissions || [],
			});
			setSelectedPermissionIds(initialData.permissions || []);
		}
	}, [initialData, reset]);

	// Notify parent component of form changes (useful for edit mode)
	useEffect(() => {
		if (onFormChange) {
			onFormChange({
				name: watchedName || "",
				description: watchedDescription,
				permissions: selectedPermissionIds,
			});
		}
	}, [watchedName, watchedDescription, selectedPermissionIds, onFormChange]);

	const handlePermissionChange = (permissionIds: string[]) => {
		setSelectedPermissionIds(permissionIds);
		setValue("permissions", permissionIds);
	};

	const onFormSubmit = (data: BaseRoleFormData) => {
		const formData: BaseRoleFormData = {
			name: data.name,
			description: data.description,
			permissions: selectedPermissionIds,
		};

		onSubmit(formData);
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Button variant="ghost" size="sm" onClick={onCancel} className="p-2">
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<div className="flex items-center gap-2">
							<CardTitle>{title}</CardTitle>
							{showPendingChanges && (
								<span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full animate-pulse">
									Cambios pendientes
								</span>
							)}
						</div>
					</div>
					<Button
						onClick={handleSubmit(onFormSubmit)}
						disabled={isLoading}
						className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700"
					>
						<SubmitIcon className="h-4 w-4" />
						{submitButtonText}
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{/* Additional content (for loading, error states, etc.) */}
				{additionalContent}

				<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
					{/* Basic role information */}
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">{LABELS.ROLE_NAME}</Label>
							<Input
								id="name"
								{...register("name")}
								placeholder={PLACEHOLDERS.ROLE_NAME}
								className={errors.name ? "border-red-500" : ""}
							/>
							{errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">{LABELS.ROLE_DESCRIPTION}</Label>
							<Input
								id="description"
								{...register("description")}
								placeholder={PLACEHOLDERS.ROLE_DESCRIPTION}
								className={errors.description ? "border-red-500" : ""}
							/>
							{errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
						</div>
					</div>

					{/* Permissions */}
					<PermissionSelector
						selectedPermissionIds={selectedPermissionIds}
						onChange={handlePermissionChange}
						error={errors.permissions?.message}
						disabled={isLoading}
					/>
				</form>
			</CardContent>
		</Card>
	);
};
