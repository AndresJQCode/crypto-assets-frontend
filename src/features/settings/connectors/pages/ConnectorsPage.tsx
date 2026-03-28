import { Plug } from "lucide-react";
import { ConnectorList } from "../components";

export const ConnectorsPage = () => {
	return (
		<div className="space-y-6">
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
					<Plug className="w-5 h-5 text-primary" />
				</div>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Integraciones</h1>
					<p className="text-muted-foreground">Conecta tu tienda online para sincronizar productos y pedidos</p>
				</div>
			</div>

			<ConnectorList />
		</div>
	);
};
