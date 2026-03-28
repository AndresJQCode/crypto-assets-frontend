import { endpoints } from "../constants";
import type { ConnectorDefinition, CreateConnectorDefinition } from "../types";

export const createConnectorDefinition = async (data: CreateConnectorDefinition): Promise<ConnectorDefinition> => {
	const formData = new FormData();
	formData.append("name", data.name);
	formData.append("type", data.type);
	formData.append("description", data.description);
	formData.append("isActive", String(data.isActive));

	if (data.logo) {
		formData.append("logo", data.logo);
	}

	const response = await fetch(endpoints.list(), {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Error al crear la definición del conector");
	}

	return response.json();
};
