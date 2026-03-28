import { MoreHorizontal, Pencil, Power, PowerOff, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ConnectorDefinition } from "../types";

interface ConnectorDefinitionListItemProps {
	connector: ConnectorDefinition;
	onEdit: (connector: ConnectorDefinition) => void;
	onToggle: (connector: ConnectorDefinition) => void;
	onDelete: (connector: ConnectorDefinition) => void;
}

const typeLabels: Record<string, string> = {
	shopify: "Shopify",
	woocommerce: "WooCommerce",
	whatsapp: "WhatsApp",
	carrier: "Carrier",
};

export const ConnectorDefinitionListItem = ({
	connector,
	onEdit,
	onToggle,
	onDelete,
}: ConnectorDefinitionListItemProps) => {
	return (
		<div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-gray-300 transition-colors">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div
						className={cn(
							"w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold",
							connector.isActive ? "bg-primary" : "bg-gray-400",
						)}
					>
						{connector.name.charAt(0).toUpperCase()}
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h3 className="font-medium">{connector.name}</h3>
							<Badge variant="outline" className="text-xs">
								{typeLabels[connector.type] || connector.type}
							</Badge>
						</div>
						<p className="text-sm text-muted-foreground line-clamp-1">{connector.description}</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Badge variant={connector.isActive ? "default" : "secondary"}>
						{connector.isActive ? "Activo" : "Inactivo"}
					</Badge>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<MoreHorizontal className="h-4 w-4" />
								<span className="sr-only">Abrir menú</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => onEdit(connector)}>
								<Pencil className="mr-2 h-4 w-4" />
								Editar
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onToggle(connector)}>
								{connector.isActive ? (
									<>
										<PowerOff className="mr-2 h-4 w-4" />
										Desactivar
									</>
								) : (
									<>
										<Power className="mr-2 h-4 w-4" />
										Activar
									</>
								)}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => onDelete(connector)} className="text-destructive focus:text-destructive">
								<Trash2 className="mr-2 h-4 w-4" />
								Eliminar
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
};
