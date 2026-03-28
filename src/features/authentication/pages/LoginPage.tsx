import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearch } from "@tanstack/react-router";
import { Loader2, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import logo from "@/assets/logos/lulo-crm.png";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { ProviderButton } from "../components";
import { useAuthConfig, useEnabledProviders, useLogin, useLoginWithProvider } from "../hooks";
import { type LoginFormData, loginSchema } from "../schemas";

export const LoginPage = () => {
	const search = useSearch({ from: ROUTES.LOGIN }) as { redirect?: string; message?: string; error?: string };
	const { data: authConfig } = useAuthConfig();
	const enabledProviders = useEnabledProviders();
	const loginMutation = useLogin();
	const providerMutation = useLoginWithProvider();
	const { submitWithRecaptcha } = useRecaptcha();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = submitWithRecaptcha<LoginFormData>("LOGIN", (data) => loginMutation.mutate(data));

	const handleProviderLogin = (provider: "microsoft" | "google") => {
		providerMutation.mutate({ provider, flow: "login" });
	};

	const showEmailLogin = authConfig?.emailLogin ?? true;
	const showProviders = enabledProviders.length > 0;
	const showSeparator = showEmailLogin && showProviders;

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<div className="flex justify-center mb-6">
						<img src={logo} alt="Logo" />
					</div>
					<CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
					<CardDescription className="text-center">Ingresa a tu cuenta para continuar</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Mensaje de redirección (ej. sin permisos) o éxito (ej. reset password) */}
					{search?.message && (
						<Alert variant="warning">
							<AlertDescription>{search.message}</AlertDescription>
						</Alert>
					)}

					{/* Mensaje de error si viene con error */}
					{search?.error && (
						<Alert variant="destructive">
							<AlertDescription>{search.error}</AlertDescription>
						</Alert>
					)}

					{/* Formulario de Email/Password */}
					{showEmailLogin && (
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<div className="relative">
													<Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
													<Input type="email" placeholder="tu@email.com" className="pl-10" {...field} />
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Contraseña</FormLabel>
											<FormControl>
												<div className="relative">
													<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
													<Input type="password" placeholder="Tu contraseña" className="pl-10" {...field} />
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{loginMutation.error && (
									<div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{loginMutation.error.message}</div>
								)}

								<div className="text-center">
									<Link to="/forgot-password" className="text-blue-600 hover:text-blue-500 font-medium">
										¿Olvidaste tu contraseña?
									</Link>
								</div>
								<Button type="submit" className="w-full" disabled={loginMutation.isPending}>
									{loginMutation.isPending ? (
										<>
											<Loader2 className="w-4 h-4 animate-spin mr-2" />
											Iniciando sesión...
										</>
									) : (
										"Iniciar Sesión"
									)}
								</Button>

								{/* Enlaces: recuperar contraseña y registro */}
								<div className="text-center">
									¿No tienes cuenta?{" "}
									<Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
										crea una aquí
									</Link>
								</div>
							</form>
						</Form>
					)}

					{/* Separador */}
					{showSeparator && (
						<div className="relative">
							<Separator />
							<div className="absolute inset-0 flex items-center justify-center">
								<span className="bg-white px-2 text-sm text-gray-500">o</span>
							</div>
						</div>
					)}

					{/* Botones de proveedores externos */}
					{showProviders && (
						<div className="space-y-3">
							{enabledProviders.includes("microsoft") && (
								<ProviderButton
									provider="microsoft"
									onClick={() => handleProviderLogin("microsoft")}
									loading={providerMutation.isPending}
								/>
							)}

							{enabledProviders.includes("google") && (
								<ProviderButton
									provider="google"
									onClick={() => handleProviderLogin("google")}
									loading={providerMutation.isPending}
								/>
							)}
						</div>
					)}

					{/* Error de proveedores */}
					{providerMutation.error && (
						<div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{providerMutation.error.message}</div>
					)}

					{/* Mensaje si no hay métodos de login configurados */}
					{!showEmailLogin && !showProviders && (
						<div className="text-center text-gray-500 py-8">
							<p>No hay métodos de autenticación configurados.</p>
							<p className="text-sm mt-2">Contacta al administrador del sistema.</p>
						</div>
					)}

					{/* Enlaces adicionales */}
					<div className="text-center space-y-2">
						<Separator />
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default LoginPage;
