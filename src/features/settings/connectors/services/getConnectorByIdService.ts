import { endpoints } from "../constants";
import type { ConnectorInstance } from "../types";

export const getConnectorById = async (id: string): Promise<ConnectorInstance> => {
	const response = await fetch(endpoints.byId(id));

	if (!response.ok) {
		throw new Error("Error al obtener el conector");
	}

	return response.json();
};
