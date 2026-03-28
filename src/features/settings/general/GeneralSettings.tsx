import { AlertCircle, Bell, Loader2, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useGetGeneralSettings, useUpdateGeneralSettings } from "./hooks";

export const GeneralSettings = () => {
	const { data: settings, isLoading, error, refetch } = useGetGeneralSettings();
	const updateSettingsMutation = useUpdateGeneralSettings();

	const handleToggleSendInvitationEmail = (checked: boolean) => {
		updateSettingsMutation.mutate({
			sendInvitationEmail: checked,
		});
	};

	// Show loading state
	if (isLoading) {
		return (
			<div className="container max-w-5xl py-8 px-6">
				<div className="flex items-center justify-center py-12">
					<div className="flex items-center gap-3">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
						<span className="text-muted-foreground">Cargando configuración...</span>
					</div>
				</div>
			</div>
		);
	}

	// Show error state
	if (error || !settings) {
		return (
			<div className="container max-w-5xl py-8 px-6">
				<div className="space-y-6">
					<div className="space-y-2">
						<h1 className="text-3xl font-bold tracking-tight">Configuración General</h1>
						<p className="text-muted-foreground">Configura las preferencias generales del sistema</p>
					</div>
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error al cargar la configuración</AlertTitle>
						<AlertDescription>
							No se pudo cargar la configuración general. Por favor, intenta nuevamente.
						</AlertDescription>
					</Alert>
					<Button onClick={() => refetch()} variant="outline">
						Reintentar
					</Button>
				</div>
			</div>
		);
	}

	const sendInvitationEmail = settings.sendInvitationEmail;
	const isUpdating = updateSettingsMutation.isPending;

	return (
		<div className="container max-w-5xl py-8 px-6">
			<div className="space-y-6">
				{/* Header */}
				<div className="space-y-2">
					<h1 className="text-3xl font-bold tracking-tight">Configuración General</h1>
					<p className="text-muted-foreground">Configura las preferencias generales del sistema</p>
				</div>

				<Separator />

				{/* Notifications Section */}
				<Card>
					<CardHeader>
						<div className="flex items-center gap-2">
							<Bell className="h-5 w-5 text-muted-foreground" />
							<CardTitle>Notificaciones</CardTitle>
						</div>
						<CardDescription>Configura cómo y cuándo enviar notificaciones a los usuarios</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{/* Email Invitation Setting */}
						<div className="flex items-center justify-between space-x-4">
							<div className="flex items-start space-x-3 flex-1">
								<Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
								<div className="space-y-1 flex-1">
									<Label htmlFor="send-invitation-email" className="text-base font-medium cursor-pointer">
										Enviar invitación por correo
									</Label>
									<p className="text-sm text-muted-foreground">
										Cuando se cree un nuevo usuario, se enviará automáticamente un correo de invitación con las
										instrucciones para acceder al sistema.
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{isUpdating && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
								<Switch
									id="send-invitation-email"
									checked={sendInvitationEmail}
									onCheckedChange={handleToggleSendInvitationEmail}
									disabled={isUpdating}
									aria-label="Activar o desactivar el envío de invitaciones por correo"
								/>
							</div>
						</div>

						<Separator />

						{/* Status info */}
						<div className="rounded-lg bg-muted/50 p-4">
							<div className="flex items-start gap-3">
								<div className="flex-shrink-0">
									{sendInvitationEmail ? (
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
											<Mail className="h-4 w-4 text-green-600" />
										</div>
									) : (
										<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
											<Mail className="h-4 w-4 text-gray-400" />
										</div>
									)}
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium">
										{sendInvitationEmail ? "Notificaciones activas" : "Notificaciones desactivadas"}
									</p>
									<p className="text-sm text-muted-foreground mt-1">
										{sendInvitationEmail
											? "Los nuevos usuarios recibirán un correo de bienvenida con sus credenciales de acceso."
											: "Los administradores deberán proporcionar manualmente las credenciales a los nuevos usuarios."}
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Future sections can be added here */}
			</div>
		</div>
	);
};
