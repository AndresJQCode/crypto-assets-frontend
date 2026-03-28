import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, Mail, Save, User, UserCheck } from "lucide-react";
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { AuthUser } from "@/features/authentication/types";
import { useUpdateProfile } from "../hooks";
import { type UpdateProfileFormData, updateProfileSchema } from "../schema";

interface ProfileInfoCardProps {
	user: AuthUser | null;
}

export const ProfileInfoCard = memo(function ProfileInfoCard({ user }: ProfileInfoCardProps) {
	const [isEditing, setIsEditing] = useState(false);

	const form = useForm<UpdateProfileFormData>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
		},
	});

	const updateProfileMutation = useUpdateProfile({
		onSuccess: (updatedUser: AuthUser) => {
			form.reset({
				name: updatedUser.name,
				email: updatedUser.email,
			});
			setIsEditing(false);
		},
	});

	const onSubmit = (data: UpdateProfileFormData) => {
		updateProfileMutation.mutate({ name: data.name });
	};

	const handleEditClick = () => {
		setIsEditing(true);
		form.reset({
			name: user?.name || "",
			email: user?.email || "",
		});
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		form.reset({
			name: user?.name || "",
			email: user?.email || "",
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 pt-4">
						<UserCheck className="h-5 w-5" />
						Información personal
					</div>
					{!isEditing && (
						<Button onClick={handleEditClick} className="flex items-center gap-2">
							<Edit className="h-4 w-4" />
							Editar perfil
						</Button>
					)}
				</CardTitle>
				<CardDescription>
					{isEditing
						? "Modifica tu información personal. El correo electrónico no se puede cambiar por seguridad."
						: "Tu información personal y datos de contacto"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{isEditing ? (
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre completo</FormLabel>
										<FormControl>
											<Input placeholder="Ingresa tu nombre completo" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Correo electrónico</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="Ingresa tu correo electrónico"
												readOnly
												className="bg-gray-50 cursor-not-allowed"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-end gap-2 pt-4">
								<Button type="button" variant="outline" onClick={handleCancelEdit}>
									Cancelar
								</Button>
								<Button
									type="submit"
									disabled={!form.formState.isDirty || updateProfileMutation.isPending}
									className="flex items-center gap-2"
								>
									{updateProfileMutation.isPending ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Guardando...
										</>
									) : (
										<>
											<Save className="h-4 w-4" />
											Guardar cambios
										</>
									)}
								</Button>
							</div>
						</form>
					</Form>
				) : (
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
									<User className="h-4 w-4" />
									Nombre completo
								</div>
								<p className="text-lg font-semibold">{user?.name || "No especificado"}</p>
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-sm font-medium text-gray-700">
									<Mail className="h-4 w-4" />
									Correo electrónico
								</div>
								<p className="text-lg">{user?.email || "No especificado"}</p>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
});
