import { useMutation } from "@tanstack/react-query";
import { initiateOAuth } from "../services";
import type { InitiateOAuthRequest } from "../types";

export const useInitiateOAuth = () => {
	return useMutation({
		mutationFn: (request: InitiateOAuthRequest) => initiateOAuth(request),
		onSuccess: (data) => {
			// Redirigir al usuario a la URL de autorización OAuth
			window.location.href = data.authorizationUrl;
		},
	});
};
