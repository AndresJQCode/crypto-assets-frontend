import { MoreVertical, Power, PowerOff, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getConnectorMetadata } from "../constants";
import type { ConnectorInstance } from "../types";
import { ConnectorIcon } from "./ConnectorIcon";
import { ConnectorStatusBadge } from "./ConnectorStatusBadge";

interface ConnectorCardProps {
	connector: ConnectorInstance;
	onConnect: (connector: ConnectorInstance) => void;
	onToggle: (connector: ConnectorInstance, isEnabled: boolean) => void;
	onDisconnect: (connector: ConnectorInstance) => void;
	isLoading?: boolean;
}

export const ConnectorCard = ({
	connector,
	onConnect,
	onToggle,
	onDisconnect,
	isLoading = false,
}: ConnectorCardProps) => {
	const metadata = getConnectorMetadata(connector.type);
	const isConnected = connector.status === "configured_enabled" || connector.status === "configured_disabled";
	const isEnabled = connector.status === "configured_enabled";

	const handlePrimaryAction = () => {
		if (connector.status === "not_configured") {
			onConnect(connector);
		}
	};

	return (
		<Card className="relative overflow-hidden">
			<CardHeader>
				<div className="flex items-start gap-4">
					<ConnectorIcon type={connector.type} />
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between gap-2">
							<CardTitle className="text-lg">{metadata.name}</CardTitle>
							{isConnected && (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<MoreVertical className="h-4 w-4" />
											<span className="sr-only">Opciones</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										{isEnabled ? (
											<DropdownMenuItem onClick={() => onToggle(connector, false)}>
												<PowerOff className="mr-2 h-4 w-4" />
												Deshabilitar
											</DropdownMenuItem>
										) : (
											<DropdownMenuItem onClick={() => onToggle(connector, true)}>
												<Power className="mr-2 h-4 w-4" />
												Habilitar
											</DropdownMenuItem>
										)}
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => onDisconnect(connector)}
											className="text-destructive focus:text-destructive"
										>
											<Unlink className="mr-2 h-4 w-4" />
											Desconectar
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							)}
						</div>
						<CardDescription className="mt-1 line-clamp-2">{metadata.description}</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<ConnectorStatusBadge status={connector.status} />
					{connector.status === "not_configured" && (
						<Button onClick={handlePrimaryAction} disabled={isLoading} size="sm">
							{isLoading ? "Conectando..." : "Conectar"}
						</Button>
					)}
					{connector.status === "pending" && (
						<Button disabled size="sm">
							Conectando...
						</Button>
					)}
				</div>
				{connector.storeName && (
					<p className="mt-3 text-sm text-muted-foreground">
						Tienda: <span className="font-medium text-foreground">{connector.storeName}</span>
					</p>
				)}
				{connector.lastSyncAt && (
					<p className="mt-1 text-xs text-muted-foreground">
						Última sincronización: {new Date(connector.lastSyncAt).toLocaleString("es-CO")}
					</p>
				)}
			</CardContent>
		</Card>
	);
};
