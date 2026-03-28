import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearch } from "@tanstack/react-router";
import { CheckCircle, Loader2, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { useResetPassword } from "../hooks";
import { type ResetPasswordFormData, resetPasswordSchema } from "../schemas";

export const ResetPasswordPage = () => {
	const search = useSearch({ from: "/reset-password" }) as {
		token?: string;
	};
	const resetPasswordMutation = useResetPassword();

	// Obtener el token de la URL
	const token = search.token;

	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		mode: "onChange",
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = (data: ResetPasswordFormData) => {
		if (!token) {
			form.setError("password", { message: "Token de restablecimiento inválido o expirado" });
			return;
		}

		resetPasswordMutation.mutate({
			token,
			password: data.password,
			confirmPassword: data.confirmPassword,
		});
	};

	// Si no hay token, mostrar error
	if (!token) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl font-bold text-center text-red-600">Enlace Inválido</CardTitle>
						<CardDescription className="text-center">
							El enlace de restablecimiento es inválido o ha expirado
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="text-center space-y-4">
							<p className="text-sm text-gray-600">
								Por favor, solicita un nuevo enlace de restablecimiento de contraseña.
							</p>
						</div>

						<div className="space-y-3">
							<Link to="/forgot-password">
								<Button className="w-full">Solicitar Nuevo Enlace</Button>
							</Link>

							<Link to={ROUTES.LOGIN}>
								<Button variant="ghost" className="w-full">
									Volver al Login
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Si la operación fue exitosa, mostrar mensaje de confirmación
	if (resetPasswordMutation.isSuccess) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1">
						<div className="flex items-center justify-center mb-4">
							<CheckCircle className="h-12 w-12 text-green-600" />
						</div>
						<CardTitle className="text-2xl font-bold text-center">Contraseña Restablecida</CardTitle>
						<CardDescription className="text-center">Tu contraseña ha sido restablecida exitosamente</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="text-center space-y-4">
							<p className="text-sm text-gray-600">Ya puedes iniciar sesión con tu nueva contraseña.</p>
						</div>

						<Link to={ROUTES.LOGIN}>
							<Button className="w-full">Ir al Login</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">Restablecer Contraseña</CardTitle>
					<CardDescription className="text-center">Ingresa tu nueva contraseña</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nueva contraseña</FormLabel>
										<FormControl>
											<div className="relative">
												<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
												<Input type="password" placeholder="Tu nueva contraseña" className="pl-10" {...field} />
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirmar nueva contraseña</FormLabel>
										<FormControl>
											<div className="relative">
												<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
												<Input
													type="password"
													placeholder="Confirma tu nueva contraseña"
													className="pl-10"
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{resetPasswordMutation.error && (
								<div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
									{resetPasswordMutation.error.message}
								</div>
							)}

							<Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
								{resetPasswordMutation.isPending ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin mr-2" />
										Restableciendo...
									</>
								) : (
									"Restablecer Contraseña"
								)}
							</Button>
						</form>
					</Form>

					<div className="text-center">
						<Link to={ROUTES.LOGIN} className="text-sm text-blue-600 hover:text-blue-500 font-medium">
							Volver al login
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ResetPasswordPage;
