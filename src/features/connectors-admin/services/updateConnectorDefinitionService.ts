import { endpoints } from "../constants";
import type { ConnectorDefinition, UpdateConnectorDefinition } from "../types";

export const updateConnectorDefinition = async (data: UpdateConnectorDefinition): Promise<ConnectorDefinition> => {
	const formData = new FormData();

	if (data.name !== undefined) {
		formData.append("name", data.name);
	}
	if (data.type !== undefined) {
		formData.append("type", data.type);
	}
	if (data.description !== undefined) {
		formData.append("description", data.description);
	}
	if (data.isActive !== undefined) {
		formData.append("isActive", String(data.isActive));
	}
	if (data.logo) {
		formData.append("logo", data.logo);
	}

	const response = await fetch(endpoints.byId(data.id), {
		method: "PATCH",
		body: formData,
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Error al actualizar la definición del conector");
	}

	return response.json();
};
