/// <reference types="vite/client" />

/**
 * Declaraciones de tipos para las variables de entorno de Vite
 * Esto proporciona autocompletado y verificación de tipos para import.meta.env
 */
interface ImportMetaEnv {
	// Variables de entorno requeridas
	readonly VITE_API_URL: string;

	// Variables de autenticación
	readonly VITE_AUTH_EMAIL_ENABLED?: string;

	// Microsoft Authentication
	readonly VITE_AUTH_MICROSOFT_ENABLED?: string;
	readonly VITE_AUTH_MICROSOFT_CLIENT_ID?: string;
	readonly VITE_AUTH_MICROSOFT_REDIRECT_URI?: string;

	// Google Authentication
	readonly VITE_AUTH_GOOGLE_ENABLED?: string;
	readonly VITE_AUTH_GOOGLE_CLIENT_ID?: string;
	readonly VITE_AUTH_GOOGLE_REDIRECT_URI?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
