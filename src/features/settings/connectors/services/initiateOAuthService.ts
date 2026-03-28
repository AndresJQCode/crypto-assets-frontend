import { endpoints } from "../constants";
import type { InitiateOAuthRequest, InitiateOAuthResponse } from "../types";

export const initiateOAuth = async (request: InitiateOAuthRequest): Promise<InitiateOAuthResponse> => {
	const response = await fetch(endpoints.oauthInitiate(), {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(request),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Error al iniciar la autorización OAuth");
	}

	return response.json();
};
