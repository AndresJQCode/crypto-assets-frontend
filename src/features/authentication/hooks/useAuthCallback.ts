import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { processAuthCallback } from "../services";
import type { AuthProvider } from "../types";

// Hook para procesar el callback de autenticación con proveedores externos
export const useAuthCallback = () => {
	const navigate = useNavigate();
	const { startLogin, successLogin, failureLogin } = useAuth();

	return useMutation({
		mutationKey: ["auth", "callback"],
		retry: 0,
		mutationFn: async ({ provider, code, state }: { provider: AuthProvider; code: string; state?: string }) => {
			startLogin();
			return processAuthCallback({ provider, code, state });
		},
		onSuccess: (data) => {
			// Guardar en Redux (redux-persist se encarga del localStorage automáticamente)
			successLogin(data);

			// Redirigir al dashboard
			navigate({ to: ROUTES.DASHBOARD });
		},
		onError: () => {
			failureLogin();
		},
	});
};
