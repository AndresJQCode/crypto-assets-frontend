import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import logo from "@/logo.svg";
import { useForgotPassword } from "../hooks";
import { type ForgotPasswordFormData, forgotPasswordSchema } from "../schemas";

export const ForgotPasswordPage = () => {
	const forgotPasswordMutation = useForgotPassword();
	const { submitWithRecaptcha } = useRecaptcha();

	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = submitWithRecaptcha<ForgotPasswordFormData>("FORGOT_PASSWORD", (data) =>
		forgotPasswordMutation.mutate(data),
	);

	// Si la solicitud fue exitosa, mostrar mensaje de confirmación
	if (forgotPasswordMutation.isSuccess) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1">
						<div className="flex justify-center mb-6">
							<img src={logo} alt="Logo" className="h-16 w-16" />
						</div>
						<div className="flex items-center justify-center mb-4">
							<CheckCircle className="h-12 w-12 text-green-600" />
						</div>
						<CardTitle className="text-2xl font-bold text-center">Email Enviado</CardTitle>
						<CardDescription className="text-center">
							Hemos enviado las instrucciones de recuperación a tu email
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="text-center space-y-4">
							<p className="text-sm text-gray-600">
								Si el email está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña en
								los próximos minutos.
							</p>
							<p className="text-sm text-gray-600">No olvides revisar tu carpeta de spam.</p>
						</div>

						<Separator />

						<div className="space-y-3">
							<Button
								variant="outline"
								className="w-full"
								onClick={() => {
									forgotPasswordMutation.reset();
									form.reset();
								}}
							>
								<Mail className="w-4 h-4 mr-2" />
								Enviar otro email
							</Button>

							<Link to={ROUTES.LOGIN}>
								<Button variant="ghost" className="w-full">
									<ArrowLeft className="w-4 h-4 mr-2" />
									Volver al login
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<div className="flex justify-center mb-6">
						<img src={logo} alt="Logo" className="h-16 w-16" />
					</div>
					<CardTitle className="text-2xl font-bold text-center">Recuperar Contraseña</CardTitle>
					<CardDescription className="text-center">
						Ingresa tu email para recibir instrucciones de recuperación
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
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

							{forgotPasswordMutation.error && (
								<div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
									{forgotPasswordMutation.error.message}
								</div>
							)}

							<Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
								{forgotPasswordMutation.isPending ? (
									<>
										<Loader2 className="w-4 h-4 animate-spin mr-2" />
										Enviando email...
									</>
								) : (
									<>
										<Mail className="w-4 h-4 mr-2" />
										Enviar Instrucciones
									</>
								)}
							</Button>
						</form>
					</Form>

					<Separator />

					<div className="text-center space-y-2">
						<Link to={ROUTES.LOGIN}>
							<Button variant="ghost" className="w-full">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Volver al login
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ForgotPasswordPage;
