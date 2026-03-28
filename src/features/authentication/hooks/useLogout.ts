import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "../services";

// Hook para logout
export const useLogout = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { performLogout, accessToken } = useAuth();

	return useMutation({
		mutationFn: () => logout(accessToken || ""),
		retry: false,
		onSuccess: () => {
			// Limpiar Redux (redux-persist se encarga del localStorage automáticamente)
			performLogout();
			// Limpiar todas las queries del cache
			queryClient.clear();
			// Redirigir al login
			navigate({ to: ROUTES.LOGIN });
		},
		onError: (error) => {
			console.log(error);
			toast.error("Error al cerrar sesión", {
				description: "Ha ocurrido un error al cerrar sesión, pero se ha limpiado el estado local.",
			});
			// Aún así, limpiar el estado local
			performLogout();
			queryClient.clear();
			navigate({ to: ROUTES.LOGIN });
		},
	});
};
