import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ROUTES } from "@/constants/routes";
import { usePermissions } from "@/contexts/usePermissions";

interface PermissionRouteProps {
	children: ReactNode;
	resource: string;
	action: string;
	/** Ruta a la que redirigir cuando no hay permiso (por defecto: login). */
	redirectTo?: string;
	/** Mensaje que se envía como parámetro de búsqueda `message` en la redirección (ej. para mostrar toast en la página destino). */
	redirectMessage?: string;
	fallback?: ReactNode;
}

interface MultiplePermissionsRouteProps {
	children: ReactNode;
	permissions: Array<{ resource: string; action: string }>;
	/** Ruta a la que redirigir cuando no hay permiso (por defecto: login). */
	redirectTo?: string;
	/** Mensaje que se envía como parámetro de búsqueda `message` en la redirección (ej. para mostrar toast en la página destino). */
	redirectMessage?: string;
	fallback?: ReactNode;
	requireAll?: boolean;
}

// Componente para proteger rutas con un permiso
export const PermissionRoute: React.FC<PermissionRouteProps> = ({
	children,
	resource,
	action,
	redirectTo = ROUTES.LOGIN,
	redirectMessage,
	fallback,
}) => {
	const { hasPermission, isLoading } = usePermissions();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
					<p className="mt-2 text-sm text-gray-600">Verificando permisos...</p>
				</div>
			</div>
		);
	}

	if (!hasPermission(resource, action)) {
		// eslint-disable-next-line no-console
		console.warn(`🚫 Ruta protegida: Acceso denegado a ruta que requiere Recurso "${resource}", Acción "${action}"`);
		if (fallback) {
			return <>{fallback}</>;
		}
		return (
			<Navigate
				to={redirectTo}
				search={redirectMessage ? (prev) => ({ ...prev, message: redirectMessage }) : undefined}
			/>
		);
	}

	return <>{children}</>;
};

// Componente para proteger rutas con múltiples permisos
export const MultiplePermissionsRoute: React.FC<MultiplePermissionsRouteProps> = ({
	children,
	permissions,
	redirectTo = ROUTES.LOGIN,
	redirectMessage,
	fallback,
	requireAll = false,
}) => {
	const { hasAnyPermission, hasAllPermissions, isLoading } = usePermissions();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
					<p className="mt-2 text-sm text-gray-600">Verificando permisos...</p>
				</div>
			</div>
		);
	}

	const hasRequiredPermissions = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);

	if (!hasRequiredPermissions) {
		const permissionList = permissions.map((p) => `"${p.resource}:${p.action}"`).join(", ");
		const requirement = requireAll ? "todos" : "al menos uno";
		// eslint-disable-next-line no-console
		console.warn(`🚫 Ruta protegida: Acceso denegado a ruta que requiere ${requirement} de [${permissionList}]`);
		if (fallback) {
			return <>{fallback}</>;
		}
		return (
			<Navigate
				to={redirectTo}
				search={redirectMessage ? (prev) => ({ ...prev, message: redirectMessage }) : undefined}
			/>
		);
	}

	return <>{children}</>;
};

// Componente para mostrar página de acceso denegado
export const UnauthorizedPage: React.FC = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<div className="text-center">
				<div className="mx-auto h-12 w-12 text-gray-400">
					<svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<title>Icono de candado</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
				</div>
				<h1 className="mt-4 text-2xl font-bold text-gray-900">Acceso Denegado</h1>
				<p className="mt-2 text-sm text-gray-600">No tienes permisos para acceder a esta página.</p>
				<div className="mt-6">
					<button
						type="button"
						onClick={() => window.location.assign("/")}
						className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Volver
					</button>
				</div>
			</div>
		</div>
	);
};
