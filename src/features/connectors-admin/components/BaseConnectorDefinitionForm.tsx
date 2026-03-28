import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, type LucideIcon } from "lucide-react";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CONNECTOR_TYPE_OPTIONS, type ConnectorType } from "../types";

const connectorDefinitionSchema = z.object({
	name: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
	type: z.enum(["bybit"], {
		message: "El tipo es requerido",
	}),
	description: z.string().min(1, "La descripción es requerida").max(500, "Máximo 500 caracteres"),
	flowType: z.enum(["internal", "external", "hybrid"], {
		message: "El tipo de flujo es requerido",
	}),
	isActive: z.boolean(),
});

export type ConnectorDefinitionFormData = z.infer<typeof connectorDefinitionSchema>;

interface BaseConnectorDefinitionFormProps {
	mode: "create" | "edit";
	initialData?: {
		name?: string;
		type?: ConnectorType;
		description?: string;
		isActive?: boolean;
	};
	onSubmit: (data: ConnectorDefinitionFormData) => void;
	onCancel: () => void;
	isLoading?: boolean;
	title: string;
	description: string;
	submitButtonText: string;
	submitButtonIcon: LucideIcon;
}

export const BaseConnectorDefinitionForm = ({
	mode,
	initialData,
	onSubmit,
	onCancel,
	isLoading = false,
	title,
	description,
	submitButtonText,
	submitButtonIcon: SubmitIcon,
}: BaseConnectorDefinitionFormProps) => {
	const nameId = useId();
	const typeId = useId();
	const descriptionId = useId();
	const isActiveId = useId();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
		reset,
	} = useForm<ConnectorDefinitionFormData>({
		mode: "onChange",
		resolver: zodResolver(connectorDefinitionSchema),
		defaultValues: {
			name: initialData?.name || "",
			type: initialData?.type,
			description: initialData?.description || "",
			isActive: initialData?.isActive ?? true,
		},
	});

	useEffect(() => {
		if (initialData && mode === "edit") {
			reset({
				name: initialData.name || "",
				type: initialData.type,
				description: initialData.description || "",
				isActive: initialData.isActive ?? true,
			});
		}
	}, [initialData, mode, reset]);

	const isActiveValue = watch("isActive");
	const typeValue = watch("type");

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
				<Button onClick={handleSubmit(onSubmit)} disabled={isLoading} className="flex items-center gap-2">
					<SubmitIcon className="h-4 w-4" />
					{isLoading ? "Procesando..." : submitButtonText}
				</Button>
			</div>

			{/* Description */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<p className="text-sm text-blue-800">{description}</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Basic Information */}
				<Card>
					<CardHeader>
						<CardTitle>Información básica</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor={nameId}>Nombre del conector</Label>
							<Input id={nameId} {...register("name")} placeholder="Ej: Shopify Colombia" disabled={isLoading} />
							{errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor={typeId}>Tipo de conector</Label>
								<Select
									value={typeValue}
									onValueChange={(value) => setValue("type", value as ConnectorType, { shouldValidate: true })}
									disabled={isLoading}
								>
									<SelectTrigger id={typeId}>
										<SelectValue placeholder="Seleccionar tipo" />
									</SelectTrigger>
									<SelectContent>
										{CONNECTOR_TYPE_OPTIONS.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.type && <p className="text-sm text-red-600">{errors.type.message}</p>}
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor={descriptionId}>Descripción</Label>
							<Textarea
								id={descriptionId}
								{...register("description")}
								placeholder="Describe para qué sirve este conector y cómo lo usarán los usuarios"
								rows={3}
								disabled={isLoading}
							/>
							{errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
						</div>
					</CardContent>
				</Card>

				{/* Status */}
				<Card>
					<CardHeader>
						<CardTitle>Estado</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center justify-between">
							<div className="space-y-0.5">
								<Label htmlFor={isActiveId}>Conector activo</Label>
								<p className="text-sm text-muted-foreground">
									{isActiveValue
										? "Los tenants podrán ver y usar este conector"
										: "Este conector no estará disponible para los tenants"}
								</p>
							</div>
							<Switch
								id={isActiveId}
								checked={isActiveValue}
								onCheckedChange={(checked) => setValue("isActive", checked)}
								disabled={isLoading}
							/>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	);
};
