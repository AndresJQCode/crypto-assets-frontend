import { endpoints } from "../constants";
import type { ConnectorDefinition } from "../types";

export const getConnectorDefinitionById = async (id: string): Promise<ConnectorDefinition> => {
	const response = await fetch(endpoints.byId(id));

	if (!response.ok) {
		throw new Error("Error al obtener la definición del conector");
	}

	return response.json();
};
