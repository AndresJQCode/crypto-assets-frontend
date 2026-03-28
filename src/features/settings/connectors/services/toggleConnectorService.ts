import { endpoints } from "../constants";
import type { ConnectorInstance, ToggleConnectorRequest } from "../types";

export const toggleConnector = async (request: ToggleConnectorRequest): Promise<ConnectorInstance> => {
	const response = await fetch(endpoints.toggle(request.id), {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ isEnabled: request.isEnabled }),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Error al cambiar el estado del conector");
	}

	return response.json();
};
