import type { UserPermission } from "@/types/permissions";

/**
 * Credenciales para login (usado en servicios)
 */
export interface LoginCredentials {
	email: string;
	password: string;
	recaptchaToken?: string;
}

/**
 * Usuario autenticado
 */
export interface AuthUser {
	id: string;
	email: string;
	name: string;
	roles: string[];
	permissions: UserPermission[];
}

/**
 * Respuesta de autenticación con tokens y usuario
 */
export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	user: AuthUser;
}

/**
 * Credenciales para registro (usado en servicios)
 */
export interface RegisterCredentials {
	name: string;
	tenantName: string;
	email: string;
	countryName: string;
	countryPhoneCode: string;
	whatsappNumber: string;
	password: string;
	confirmPassword: string;
	recaptchaToken?: string;
}

/**
 * Credenciales para recuperación de contraseña (usado en servicios)
 */
export interface ForgotPasswordCredentials {
	email: string;
	recaptchaToken?: string;
}

/**
 * Credenciales para restablecimiento de contraseña (usado en servicios)
 */
export interface ResetPasswordCredentials {
	token: string;
	password: string;
	confirmPassword: string;
}

// Los tipos de formularios (LoginFormData, RegisterFormData, etc.)
// ahora se exportan desde schemas.ts para mantener la coherencia con zod

export type AuthProvider = "microsoft" | "google";

/** Flujo de autenticación con proveedor (para identificar en el callback) */
export type AuthProviderFlow = "login" | "register";

/** Opciones para login con proveedor (p. ej. tenantName, país y whatsappNumber en registro OAuth) */
export interface LoginWithProviderOptions {
	/** Indica si el flujo es login o registro; se envía en state para el callback (por defecto 'login') */
	flow?: AuthProviderFlow;
	tenantName?: string;
	countryName?: string;
	countryPhoneCode?: string;
	whatsappNumber?: string;
}

export interface AuthProviderConfig {
	enabled: boolean;
	clientId?: string;
	tenantId?: string;
	redirectUri: string;
}

export interface AuthConfig {
	emailLogin: boolean;
	microsoft: AuthProviderConfig;
	google: AuthProviderConfig;
}

export interface AuthError {
	message: string;
	code?: string;
	field?: string;
}
