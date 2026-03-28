import { endpoints } from "../constants";

export const disconnectConnector = async (id: string): Promise<void> => {
	const response = await fetch(endpoints.byId(id), {
		method: "DELETE",
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Error al desconectar el conector");
	}
};
