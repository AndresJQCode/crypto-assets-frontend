import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleConnector } from "../services";
import type { ConnectorInstance, ToggleConnectorRequest } from "../types";

export const useToggleConnector = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (request: ToggleConnectorRequest) => toggleConnector(request),
		onSuccess: (data) => {
			// Actualizar la lista de conectores
			queryClient.setQueryData<ConnectorInstance[]>(["connectors"], (oldConnectors) => {
				if (!oldConnectors) return [data];
				return oldConnectors.map((connector) => (connector.id === data.id ? data : connector));
			});

			// Invalidar la query del conector individual
			queryClient.invalidateQueries({ queryKey: ["connector", data.id] });
		},
	});
};
