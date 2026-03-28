import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { loginWithCredentials } from "../services";
import type { LoginCredentials } from "../types";

// Hook para login con credenciales
export const useLogin = () => {
	const navigate = useNavigate();
	const { startLogin, successLogin, failureLogin } = useAuth();

	return useMutation({
		mutationKey: ["auth", "login"],
		mutationFn: async (credentials: LoginCredentials) => {
			startLogin();
			return loginWithCredentials(credentials);
		},
		onSuccess: (data) => {
			// Guardar en Redux (redux-persist se encarga del localStorage automáticamente)
			successLogin(data);

			// Redirigir al dashboard
			navigate({ to: "/dashboard" });
		},
		onError: (error) => {
			failureLogin();
			toast.error("Error en el login", {
				description: error.message || "Credenciales incorrectas. Verifica tu email y contraseña.",
			});
		},
	});
};
