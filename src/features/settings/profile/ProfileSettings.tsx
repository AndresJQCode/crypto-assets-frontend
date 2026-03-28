import { Loader2, User } from "lucide-react";
import { useEffect } from "react";
import { useCurrentUser } from "@/features/authentication/hooks";
import { useAuth } from "@/hooks/useAuth";
import { PermissionsCard, ProfileInfoCard, RolesCard } from "./components";

export const ProfileSettings = () => {
	const { user, performUpdateUser } = useAuth();

	// Consultar la información actual del usuario desde la API
	const { data: currentUserData, isLoading: isLoadingCurrentUser, error: currentUserError } = useCurrentUser();

	// Actualizar el estado del usuario cuando se obtengan los datos de la API
	useEffect(() => {
		if (currentUserData) {
			performUpdateUser(currentUserData);
		}
	}, [currentUserData, performUpdateUser]);

	// Mostrar estado de carga mientras se consulta la API
	if (isLoadingCurrentUser) {
		return (
			<div className="p-6 max-w-4xl mx-auto space-y-6">
				<div className="flex items-center justify-center py-12">
					<div className="flex items-center gap-2">
						<Loader2 className="h-6 w-6 animate-spin" />
						<span>Cargando información del perfil...</span>
					</div>
				</div>
			</div>
		);
	}

	// Mostrar error si no se pudo cargar la información del usuario
	if (currentUserError) {
		return (
			<div className="p-6 max-w-4xl mx-auto space-y-6">
				<div className="flex items-center justify-center py-12">
					<div className="text-center">
						<p className="text-red-600 mb-2">Error al cargar la información del perfil</p>
						<p className="text-gray-500 text-sm">Por favor, intenta recargar la página</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-4xl mx-auto space-y-6">
			<div className="flex items-center">
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<User className="h-6 w-6" />
					Mi perfil
				</h1>
			</div>

			<ProfileInfoCard user={user} />
			<RolesCard roles={user?.roles} />
			<PermissionsCard permissions={currentUserData?.permissions} />
		</div>
	);
};
