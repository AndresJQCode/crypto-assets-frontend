import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AuthUser } from "@/features/authentication/types";
import { useAuth } from "@/hooks/useAuth";
import { updateUserProfile } from "../services";

interface UseUpdateProfileOptions {
	onSuccess?: (updatedUser: AuthUser) => void;
	onError?: (error: Error) => void;
}

export const useUpdateProfile = (options?: UseUpdateProfileOptions) => {
	const { performUpdateUser } = useAuth();

	return useMutation({
		mutationFn: updateUserProfile,
		onSuccess: (updatedUser: AuthUser) => {
			// Actualizar el estado global del usuario en Redux
			performUpdateUser(updatedUser);
			// Mostrar toast de éxito
			toast.success("Perfil actualizado");
			// Ejecutar callback personalizado si existe
			options?.onSuccess?.(updatedUser);
		},
		onError: (error: Error) => {
			// Mostrar toast de error
			toast.error("Error al actualizar perfil", {
				description: error.message || "Ha ocurrido un error inesperado. Inténtalo de nuevo.",
			});
			// Ejecutar callback personalizado si existe
			options?.onError?.(error);
		},
	});
};
