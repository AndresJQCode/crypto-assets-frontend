import { endpoints } from "../constants";

export const deleteRole = async (id: string): Promise<void> => {
	const response = await fetch(endpoints.byId(id), {
		method: "DELETE",
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Error al eliminar el rol");
	}
};
