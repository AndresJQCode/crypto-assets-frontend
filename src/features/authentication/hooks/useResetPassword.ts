import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { resetPassword } from "../services";

// Hook para restablecer contraseña
export const useResetPassword = () => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: resetPassword,
		onSuccess: () => {
			// Redirigir al login después de restablecer contraseña exitosamente
			navigate({
				to: ROUTES.LOGIN,
				search: {
					message: "Contraseña restablecida exitosamente. Puedes iniciar sesión con tu nueva contraseña.",
				},
			});
		},
		onError: (error) => {
			toast.error("Error al restablecer contraseña", {
				description: error.message || "Ha ocurrido un error al restablecer tu contraseña. Inténtalo de nuevo.",
			});
		},
	});
};
