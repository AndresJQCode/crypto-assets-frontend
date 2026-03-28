import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useLogout } from "../hooks/useLogout";

export const LogoutPage = () => {
	const { mutate: logout } = useLogout();

	// biome-ignore lint/correctness/useExhaustiveDependencies: no dependencies
	useEffect(() => {
		// Ejecutar logout automáticamente al cargar la página
		logout();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full space-y-8 p-8">
				<div className="text-center">
					<div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
						<Loader2 className="h-6 w-6 animate-spin text-blue-600" />
					</div>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">Cerrando sesión</h2>
					<p className="mt-2 text-sm text-gray-600">Por favor espera mientras cerramos tu sesión de forma segura...</p>
				</div>
			</div>
		</div>
	);
};
