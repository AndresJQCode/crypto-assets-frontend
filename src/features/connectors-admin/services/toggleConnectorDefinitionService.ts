import { endpoints } from "../constants";
import type { ConnectorDefinition } from "../types";

export const toggleConnectorDefinition = async (id: string, isActive: boolean): Promise<ConnectorDefinition> => {
	const response = await fetch(endpoints.toggle(id), {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ isActive }),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Error al cambiar el estado del conector");
	}

	return response.json();
};
