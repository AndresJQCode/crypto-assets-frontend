import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectorIcon } from "@/features/settings/connectors/components/ConnectorIcon";

export const Route = createFileRoute("/_admin/settings/connectors/callback/bybit")({
	component: BybitCallbackPage,
});

function BybitCallbackPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const searchParams = new URLSearchParams(window.location.search);
	const error = searchParams.get("error");
	const errorDescription = searchParams.get("error_description");

	useEffect(() => {
		queryClient.invalidateQueries({ queryKey: ["connectors"] });

		const timer = setTimeout(() => {
			if (error) {
				toast.error("Error al conectar Bybit", {
					description: errorDescription || "No se pudo completar la autorización",
				});
			} else {
				toast.success("Bybit conectado exitosamente");
			}
			navigate({ to: "/settings/connectors" });
		}, 2000);

		return () => clearTimeout(timer);
	}, [error, errorDescription, navigate, queryClient]);

	return (
		<div className="flex items-center justify-center min-h-[60vh]">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="flex justify-center mb-4">
						<ConnectorIcon type="bybit" size="lg" />
					</div>
					<CardTitle>{error ? "Error de conexión" : "Conectando Bybit..."}</CardTitle>
					<CardDescription>
						{error
							? errorDescription || "No se pudo completar la autorización con Bybit"
							: "Procesando la autorización de tu cuenta Bybit"}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex justify-center">
					{!error && (
						<div className="flex items-center gap-2 text-muted-foreground">
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
							<span>Redirigiendo...</span>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
