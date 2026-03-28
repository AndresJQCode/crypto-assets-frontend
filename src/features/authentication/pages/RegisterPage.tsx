import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Building2, Eye, EyeOff, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import logo from "@/assets/logos/lulo-crm.png";
import { CountryCombobox } from "@/components/CountryCombobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getCountryByCode } from "@/constants/countries";
import { ROUTES } from "@/constants/routes";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { PasswordRequirementsDisplay, ProviderButton } from "../components";
import { useAuthConfig, useEnabledProviders, useLoginWithProvider, useRegister } from "../hooks";
import { type OAuthTenantFormData, oauthTenantSchema, type RegisterFormData, registerSchema } from "../schemas";
import type { AuthProvider } from "../types";

export const RegisterPage = () => {
	const { data: authConfig } = useAuthConfig();
	const enabledProviders = useEnabledProviders();
	const registerMutation = useRegister();
	const providerMutation = useLoginWithProvider();
	const { submitWithRecaptcha } = useRecaptcha();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [oauthDialogOpen, setOauthDialogOpen] = useState(false);
	const [oauthProvider, setOauthProvider] = useState<AuthProvider | null>(null);

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		mode: "onChange",
		defaultValues: {
			name: "",
			tenantName: "",
			countryCode: "",
			whatsappNumber: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const password = form.watch("password");

	const oauthTenantForm = useForm<OAuthTenantFormData>({
		resolver: zodResolver(oauthTenantSchema),
		mode: "onChange",
		defaultValues: { tenantName: "", countryCode: "", whatsappNumber: "" },
	});

	const onSubmit = submitWithRecaptcha<RegisterFormData>("REGISTER", (data) => {
		const country = getCountryByCode(data.countryCode);
		if (!country) return;
		const { countryCode: _code, ...rest } = data;
		registerMutation.mutate({
			...rest,
			countryName: country.name,
			countryPhoneCode: country.phoneCode,
		});
	});

	const openOauthDialog = (provider: AuthProvider) => {
		setOauthProvider(provider);
		oauthTenantForm.reset({ tenantName: "", countryCode: "", whatsappNumber: "" });
		setOauthDialogOpen(true);
	};

	const onOauthTenantSubmit = (data: OAuthTenantFormData) => {
		if (!oauthProvider) return;
		const country = getCountryByCode(data.countryCode);
		if (!country) return;
		providerMutation.mutate({
			provider: oauthProvider,
			flow: "register",
			tenantName: data.tenantName,
			countryName: country.name,
			countryPhoneCode: country.phoneCode,
			whatsappNumber: data.whatsappNumber,
		});
		setOauthDialogOpen(false);
		setOauthProvider(null);
	};

	const handleProviderRegister = (provider: AuthProvider) => {
		openOauthDialog(provider);
	};

	const showEmailRegister = authConfig?.emailLogin ?? true;
	const showProviders = enabledProviders.length > 0;
	const showSeparator = showEmailRegister && showProviders;
	const providerNames: Record<AuthProvider, string> = { microsoft: "Microsoft", google: "Google" };

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			{/* Diálogo: nombre de empresa para registro con OAuth */}
			<Dialog open={oauthDialogOpen} onOpenChange={setOauthDialogOpen}>
				<DialogContent className="sm:max-w-md" showCloseButton={!providerMutation.isPending}>
					<DialogHeader>
						<DialogTitle>Datos para registrarte</DialogTitle>
						<DialogDescription>
							{oauthProvider &&
								`Para registrarte con ${providerNames[oauthProvider]}, indica el nombre de tu empresa, tu país y tu número de WhatsApp. Se usará para contactarte.`}
						</DialogDescription>
					</DialogHeader>
					<Form {...oauthTenantForm}>
						<form onSubmit={oauthTenantForm.handleSubmit(onOauthTenantSubmit)} className="space-y-4">
							<FormField
								control={oauthTenantForm.control}
								name="tenantName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Empresa</FormLabel>
										<FormControl>
											<div className="relative">
												<Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
												<Input type="text" placeholder="Nombre de tu empresa" className="pl-10" {...field} />
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={oauthTenantForm.control}
								name="countryCode"
								render={({ field }) => (
									<FormItem>
										<FormLabel>País</FormLabel>
										<FormControl>
											<CountryCombobox
												value={field.value}
												onChange={field.onChange}
												placeholder="Selecciona un país"
												aria-invalid={!!oauthTenantForm.formState.errors.countryCode}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={oauthTenantForm.control}
								name="whatsappNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Número de WhatsApp</FormLabel>
										<FormControl>
											<div className="relative">
												<Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
												<Input type="tel" placeholder="300 123 4567" className="pl-10" {...field} />
											</div>
										</FormControl>
										<p className="text-xs text-muted-foreground">Se usará para contactarte.</p>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter>
								<Button
									type="button"
									variant="outline"
									onClick={() => setOauthDialogOpen(false)}
									disabled={providerMutation.isPending}
								>
									Cancelar
								</Button>
								<Button type="submit" disabled={providerMutation.isPending}>
									{providerMutation.isPending ? (
										<>
											<Loader2 className="w-4 h-4 animate-spin mr-2" />
											Redirigiendo...
										</>
									) : oauthProvider ? (
										`Registrarse con ${providerNames[oauthProvider]}`
									) : (
										"Continuar"
									)}
								</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<div className="flex justify-center mb-6">
						<img src={logo} alt="Logo" />
					</div>
					<CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
					<CardDescription className="text-center">Regístrate para comenzar a usar la aplicación</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Formulario de Registro */}
					{showEmailRegister && (
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nombre completo</FormLabel>
											<FormControl>
												<div className="relative">
													<User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
													<Input type="text" placeholder="Tu nombre completo" className="pl-10" {...field} />
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="tenantName"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Empresa</FormLabel>
											<FormControl>
												<div className="relative">
													<Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
													<Input type="text" placeholder="Nombre de tu empresa" className="pl-10" {...field} />
												</div>
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
									name="countryCode"
									render={({ field }) => (
										<FormItem>
											<FormLabel>País</FormLabel>
											<FormControl>
												<CountryCombobox
													value={field.value}
													onChange={field.onChange}
													placeholder="Selecciona un país"
													aria-invalid={!!form.formState.errors.countryCode}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="whatsappNumber"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Número de WhatsApp</FormLabel>
											<FormControl>
												<div className="relative">
													<Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
													<Input type="tel" placeholder="300 123 4567" className="pl-10" {...field} />
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
													<Input
														type={showPassword ? "text" : "password"}
														placeholder="Tu contraseña"
														className="pl-10 pr-10"
														{...field}
													/>
													<button
														type="button"
														onClick={() => setShowPassword(!showPassword)}
														className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
													>
														{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
													</button>
												</div>
											</FormControl>
											<FormMessage />
											<PasswordRequirementsDisplay password={password} />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="confirmPassword"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Confirmar contraseña</FormLabel>
											<FormControl>
												<div className="relative">
													<Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
													<Input
														type={showConfirmPassword ? "text" : "password"}
														placeholder="Confirma tu contraseña"
														className="pl-10 pr-10"
														{...field}
													/>
													<button
														type="button"
														onClick={() => setShowConfirmPassword(!showConfirmPassword)}
														className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
													>
														{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
													</button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{registerMutation.error && (
									<div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{registerMutation.error.message}</div>
								)}

								<Button type="submit" className="w-full" disabled={registerMutation.isPending}>
									{registerMutation.isPending ? (
										<>
											<Loader2 className="w-4 h-4 animate-spin mr-2" />
											Creando cuenta...
										</>
									) : (
										"Crear Cuenta"
									)}
								</Button>
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
									label="Registrarse con Microsoft"
									onClick={() => handleProviderRegister("microsoft")}
									loading={providerMutation.isPending}
								/>
							)}

							{enabledProviders.includes("google") && (
								<ProviderButton
									provider="google"
									label="Registrarse con Google"
									onClick={() => handleProviderRegister("google")}
									loading={providerMutation.isPending}
								/>
							)}
						</div>
					)}

					{/* Error de proveedores */}
					{providerMutation.error && (
						<div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{providerMutation.error.message}</div>
					)}

					{/* Mensaje si no hay métodos de registro configurados */}
					{!showEmailRegister && !showProviders && (
						<div className="text-center text-gray-500 py-8">
							<p>No hay métodos de registro configurados.</p>
							<p className="text-sm mt-2">Contacta al administrador del sistema.</p>
						</div>
					)}

					{/* Enlaces */}
					<div className="text-center space-y-2">
						<Separator />
						<p className="text-sm text-gray-600">
							¿Ya tienes una cuenta?{" "}
							<Link to={ROUTES.LOGIN} className="text-blue-600 hover:text-blue-500 font-medium">
								Inicia sesión
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default RegisterPage;
