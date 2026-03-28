import { endpoints } from "../constants";

export const deleteUser = async (id: string): Promise<void> => {
	const response = await fetch(endpoints.byId(id), {
		method: "DELETE",
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ message: "Error al eliminar el usuario" }));
		throw new Error(error.message || "Error al eliminar el usuario");
	}
};
