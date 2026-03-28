// Constantes individuales para cada ruta
export const ROUTES = {
	// Rutas de autenticación
	LOGIN: "/login",
	REGISTER: "/register",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",
	LOGOUT: "/auth/logout",

	// Rutas de admin
	DASHBOARD: "/dashboard",
	CONNECTORS_INSTANCES: "/settings/connectors-instances",
	CONNECTORS_DEFINITIONS: "/connectors-definitions",
	ADMIN_USERS: "/users",
	ADMIN_ROLES: "/roles",
	ADMIN_PROFILE: "/profile",

	// Rutas de digital assets
	DIGITAL_ASSETS: "/digital-assets/assets",
	DIGITAL_ASSETS_ORDERS_OPEN: "/digital-assets/orders-open",
	DIGITAL_ASSETS_ORDERS_HISTORY: "/digital-assets/orders-history",
	DIGITAL_ASSETS_ORDERS: "/digital-assets/orders",
	DIGITAL_ASSETS_ORDER_DETAIL: (orderId: string) => `/digital-assets/orders/${orderId}` as const,

	// Rutas de callback
	AUTH_CALLBACK: "/auth/callback",
} as const;

// Rutas públicas que NO requieren autenticación
export const PUBLIC_ROUTES = [
	ROUTES.LOGIN,
	ROUTES.REGISTER,
	ROUTES.FORGOT_PASSWORD,
	ROUTES.RESET_PASSWORD,
	ROUTES.LOGOUT,
] as const;

// Función helper para verificar si una ruta es pública
export const isPublicRoute = (pathname: string): boolean => {
	return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
};

// Función helper para verificar si una ruta requiere autenticación
export const isAuthRequiredRoute = (pathname: string): boolean => {
	return !isPublicRoute(pathname);
};
