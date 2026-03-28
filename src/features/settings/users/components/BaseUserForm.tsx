import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RoleSelector } from "@/features/settings/shared/components";
import { LABELS, PLACEHOLDERS } from "@/features/settings/shared/utils/constants";
import { emailSchema, idsArraySchema, nameSchema } from "@/features/settings/shared/utils/validation-schemas";

const baseUserSchema = z.object({
	name: nameSchema,
	email: emailSchema,
	roles: idsArraySchema(1, "Debe asignar al menos un rol"),
	isActive: z.boolean().optional(),
});

export type BaseUserFormData = z.infer<typeof baseUserSchema>;

interface BaseUserFormProps {
	mode: "create" | "edit";
	initialData?: {
		name?: string;
		email?: string;
		isActive?: boolean;
		roles?: string[];
	};
	onSubmit: (data: BaseUserFormData) => void;
	onCancel: () => void;
	onFormChange?: (data: BaseUserFormData) => void;
	isLoading?: boolean;
	title: string;
	description: string;
	submitButtonText: string;
	submitButtonIcon: LucideIcon;
	submitButtonVariant?: "default" | "blue" | "gray";
	showActiveToggle?: boolean;
	emailWarning?: string;
	additionalContent?: React.ReactNode;
}

export const BaseUserForm: React.FC<BaseUserFormProps> = ({
	mode: _mode,
	initialData,
	onSubmit,
	onCancel,
	onFormChange,
	isLoading = false,
	title,
	description,
	submitButtonText,
	submitButtonIcon: SubmitIcon,
	submitButtonVariant = "default",
	showActiveToggle = false,
	emailWarning,
	additionalContent,
}) => {
	const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(initialData?.roles || []);
	const nameId = useId();
	const emailId = useId();
	const isActiveId = useId();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
		reset,
	} = useForm<BaseUserFormData>({
		mode: "onChange",
		resolver: zodResolver(baseUserSchema),
		defaultValues: {
			name: initialData?.name || "",
			email: initialData?.email || "",
			isActive: initialData?.isActive ?? true,
			roles: initialData?.roles || [],
		},
	});

	// Update form when initialData changes (useful for edit mode)
	useEffect(() => {
		if (initialData) {
			reset({
				name: initialData.name || "",
				email: initialData.email || "",
				isActive: initialData.isActive ?? true,
				roles: initialData.roles || [],
			});
			setSelectedRoleIds(initialData.roles || []);
		}
	}, [initialData, reset]);

	const isActiveValue = watch("isActive");
	const watchedName = watch("name");
	const watchedEmail = watch("email");

	// Notify parent component of form changes (useful for edit mode)
	useEffect(() => {
		if (onFormChange) {
			onFormChange({
				name: watchedName || "",
				email: watchedEmail || "",
				roles: selectedRoleIds,
				...(showActiveToggle && { isActive: isActiveValue }),
			});
		}
	}, [watchedName, watchedEmail, selectedRoleIds, isActiveValue, showActiveToggle, onFormChange]);

	const handleRoleChange = (roleIds: string[]) => {
		setSelectedRoleIds(roleIds);
		setValue("roles", roleIds, { shouldValidate: true, shouldTouch: true });
	};

	const onFormSubmit = (data: BaseUserFormData) => {
		const formData: BaseUserFormData = {
			name: data.name,
			email: data.email,
			roles: selectedRoleIds,
			...(showActiveToggle && { isActive: data.isActive }),
		};

		onSubmit(formData);
	};

	const getButtonClassName = () => {
		const base = "flex items-center gap-2";

		if (submitButtonVariant === "blue") {
			return `${base} bg-blue-600 hover:bg-blue-700`;
		}
		if (submitButtonVariant === "gray") {
			return `${base} bg-gray-600 hover:bg-gray-700`;
		}

		return base;
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="sm" onClick={onCancel} className="flex items-center gap-2">
						<ArrowLeft className="h-4 w-4" />
						Volver
					</Button>
					<div>
						<h2 className="text-xl font-semibold">{title}</h2>
					</div>
				</div>
				<Button onClick={handleSubmit(onFormSubmit)} disabled={isLoading} className={getButtonClassName()}>
					<SubmitIcon className="h-4 w-4" />
					{isLoading ? "Procesando..." : submitButtonText}
				</Button>
			</div>

			{/* Description */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<p className="text-sm text-blue-800">{description}</p>
			</div>

			{/* Additional content (for loading, error states, etc.) */}
			{additionalContent}

			<form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
				{/* User Information */}
				<Card>
					<CardHeader>
						<CardTitle>Información del usuario</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor={nameId}>{LABELS.USER_NAME}</Label>
							<Input id={nameId} {...register("name")} placeholder={PLACEHOLDERS.USER_NAME} />
							{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor={emailId}>{LABELS.USER_EMAIL}</Label>
							<Input id={emailId} type="email" {...register("email")} placeholder={PLACEHOLDERS.USER_EMAIL} />
							{errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
						</div>
						{emailWarning && <p className="text-sm text-red-800">{emailWarning}</p>}
					</CardContent>
				</Card>

				{/* Active Status (only for edit mode) */}
				{showActiveToggle && (
					<Card>
						<CardHeader>
							<CardTitle>Estado del usuario</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<div className="space-y-0.5">
									<Label htmlFor={isActiveId}>{LABELS.USER_ACTIVE}</Label>
									<p className="text-sm text-gray-600">
										{isActiveValue
											? "El usuario puede acceder al sistema y realizar acciones"
											: "El usuario no puede acceder al sistema"}
									</p>
								</div>
								<Switch
									id={isActiveId}
									checked={isActiveValue}
									onCheckedChange={(checked) => setValue("isActive", checked)}
								/>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Roles */}
				<RoleSelector
					selectedRoleIds={selectedRoleIds}
					onChange={handleRoleChange}
					error={errors.roles?.message}
					disabled={isLoading}
				/>
			</form>
		</div>
	);
};
