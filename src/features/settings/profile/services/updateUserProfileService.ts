import type { AuthUser } from "@/features/authentication/types";
import { endpoints } from "../constants";

export interface UpdateProfileRequest {
	name: string;
}

export const updateUserProfile = async (data: UpdateProfileRequest): Promise<AuthUser> => {
	const response = await fetch(endpoints.me(), {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || "Error al actualizar el perfil");
	}

	return response.json();
};
