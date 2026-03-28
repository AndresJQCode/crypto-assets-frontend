import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { registerUser } from "../services";
import type { RegisterCredentials } from "../types";

// Hook para registro de usuario
export const useRegister = () => {
	const navigate = useNavigate();
	const { startRegister, successRegister, failureRegister } = useAuth();

	return useMutation({
		mutationFn: async (credentials: RegisterCredentials) => {
			startRegister();
			return registerUser(credentials);
		},
		onSuccess: (data) => {
			// Guardar en Redux (redux-persist se encarga del localStorage automáticamente)
			successRegister(data);

			// Redirigir al dashboard
			navigate({ to: "/dashboard" });
		},
		onError: (error) => {
			failureRegister();
			toast.error("Error en el registro", {
				description: error.message || "Ha ocurrido un error al crear tu cuenta. Inténtalo de nuevo.",
			});
		},
	});
};
