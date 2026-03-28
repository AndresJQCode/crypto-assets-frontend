import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useInitiateOAuth } from "../hooks";
import { ConnectorIcon } from "./ConnectorIcon";

interface BybitConnectorProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const BybitConnector = ({ open, onOpenChange }: BybitConnectorProps) => {
	const [isConnecting, setIsConnecting] = useState(false);
	const initiateOAuth = useInitiateOAuth();

	const handleConnect = () => {
		setIsConnecting(true);

		const callbackUrl = `${window.location.origin}/settings/connectors/callback/bybit`;

		initiateOAuth.mutate(
			{
				connectorType: "bybit",
				callbackUrl,
			},
			{
				onError: () => {
					setIsConnecting(false);
				},
			},
		);
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!isConnecting) {
			onOpenChange(newOpen);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<ConnectorIcon type="bybit" size="sm" />
						<div>
							<DialogTitle>Conectar Bybit</DialogTitle>
							<DialogDescription>
								Serás redirigido a Bybit para autorizar la conexión con tu cuenta.
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="py-4">
					<div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
						<p className="font-medium text-foreground mb-2">Al conectar tu cuenta de Bybit podrás:</p>
						<ul className="list-disc list-inside space-y-1">
							<li>Operar en el exchange automáticamente</li>
							<li>Gestionar tus órdenes desde una sola plataforma</li>
							<li>Ver tu saldo y posiciones en tiempo real</li>
						</ul>
					</div>
				</div>

				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isConnecting}>
						Cancelar
					</Button>
					<Button onClick={handleConnect} disabled={isConnecting}>
						{isConnecting ? "Conectando..." : "Conectar con Bybit"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
