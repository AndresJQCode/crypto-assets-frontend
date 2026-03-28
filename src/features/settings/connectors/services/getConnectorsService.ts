import { endpoints } from "../constants";
import type { ConnectorFilters, ConnectorInstance } from "../types";

export const getConnectors = async (filters?: ConnectorFilters): Promise<ConnectorInstance[]> => {
	const params = new URLSearchParams();
	if (filters?.type) {
		params.append("type", filters.type);
	}
	if (filters?.status) {
		params.append("status", filters.status);
	}

	const queryString = params.toString();
	const url = queryString ? `${endpoints.list()}?${queryString}` : endpoints.list();

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error("Error al obtener los conectores");
	}

	return response.json();
};
