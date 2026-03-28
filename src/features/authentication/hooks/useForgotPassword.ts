import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { forgotPassword } from "../services";

// Hook para solicitar recuperación de contraseña
export const useForgotPassword = () => {
	return useMutation({
		mutationFn: forgotPassword,
		onError: (error) => {
			toast.error("Error en recuperación de contraseña", {
				description: error.message || "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
			});
		},
	});
};
