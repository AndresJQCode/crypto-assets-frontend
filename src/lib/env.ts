import { z } from "zod";

/**
 * Esquema de validación para las variables de entorno de la aplicación
 * Este esquema define todas las variables requeridas y opcionales
 */
const envSchema = z.object({
	// Variables de entorno requeridas
	VITE_API_URL: z.string().url("VITE_API_URL debe ser una URL válida"),

	// Variables de autenticación - opcionales pero validadas si están presentes
	VITE_AUTH_EMAIL_ENABLED: z
		.string()
		.optional()
		.default("true")
		.refine((val) => val === "true" || val === "false", {
			message: 'VITE_AUTH_EMAIL_ENABLED debe ser "true" o "false"',
		}),

	// Microsoft Authentication
	VITE_AUTH_MICROSOFT_ENABLED: z
		.string()
		.optional()
		.default("false")
		.refine((val) => val === "true" || val === "false", {
			message: 'VITE_AUTH_MICROSOFT_ENABLED debe ser "true" o "false"',
		}),
	VITE_AUTH_MICROSOFT_CLIENT_ID: z.string().optional(),
	VITE_AUTH_MICROSOFT_TENANT_ID: z.string().optional(),
	VITE_AUTH_MICROSOFT_REDIRECT_URI: z.string().optional(),

	// Google Authentication
	VITE_AUTH_GOOGLE_ENABLED: z
		.string()
		.optional()
		.default("false")
		.refine((val) => val === "true" || val === "false", {
			message: 'VITE_AUTH_GOOGLE_ENABLED debe ser "true" o "false"',
		}),
	VITE_AUTH_GOOGLE_CLIENT_ID: z.string().optional(),
	VITE_AUTH_GOOGLE_REDIRECT_URI: z.string().optional(),

	// reCAPTCHA v3
	VITE_RECAPTCHA_SITE_KEY: z.string({
		message: "VITE_RECAPTCHA_SITE_KEY es requerido",
	}),
});

/**
 * Refinamiento del esquema para validar dependencias entre variables
 */
const envSchemaWithRefinements = envSchema
	.refine(
		(data) => {
			// Si Microsoft está habilitado, requiere CLIENT_ID
			if (data.VITE_AUTH_MICROSOFT_ENABLED === "true") {
				return data.VITE_AUTH_MICROSOFT_CLIENT_ID && data.VITE_AUTH_MICROSOFT_CLIENT_ID.trim() !== "";
			}
			return true;
		},
		{
			message: 'VITE_AUTH_MICROSOFT_CLIENT_ID es requerido cuando VITE_AUTH_MICROSOFT_ENABLED es "true"',
			path: ["VITE_AUTH_MICROSOFT_CLIENT_ID"],
		},
	)
	.refine(
		(data) => {
			// Si Microsoft está habilitado, requiere TENANT_ID
			if (data.VITE_AUTH_MICROSOFT_ENABLED === "true") {
				return data.VITE_AUTH_MICROSOFT_TENANT_ID && data.VITE_AUTH_MICROSOFT_TENANT_ID.trim() !== "";
			}
			return true;
		},
		{
			message: 'VITE_AUTH_MICROSOFT_TENANT_ID es requerido cuando VITE_AUTH_MICROSOFT_ENABLED es "true"',
			path: ["VITE_AUTH_MICROSOFT_TENANT_ID"],
		},
	)
	.refine(
		(data) => {
			// Si Microsoft está habilitado, requiere REDIRECT_URI
			if (data.VITE_AUTH_MICROSOFT_ENABLED === "true") {
				return data.VITE_AUTH_MICROSOFT_REDIRECT_URI && data.VITE_AUTH_MICROSOFT_REDIRECT_URI.trim() !== "";
			}
			return true;
		},
		{
			message: 'VITE_AUTH_MICROSOFT_REDIRECT_URI es requerido cuando VITE_AUTH_MICROSOFT_ENABLED es "true"',
			path: ["VITE_AUTH_MICROSOFT_REDIRECT_URI"],
		},
	)
	.refine(
		(data) => {
			// Si Microsoft está habilitado y REDIRECT_URI está presente, debe ser una URL válida
			if (data.VITE_AUTH_MICROSOFT_ENABLED === "true" && data.VITE_AUTH_MICROSOFT_REDIRECT_URI) {
				try {
					new URL(data.VITE_AUTH_MICROSOFT_REDIRECT_URI);
					return true;
				} catch {
					return false;
				}
			}
			return true;
		},
		{
			message: 'VITE_AUTH_MICROSOFT_REDIRECT_URI debe ser una URL válida cuando VITE_AUTH_MICROSOFT_ENABLED es "true"',
			path: ["VITE_AUTH_MICROSOFT_REDIRECT_URI"],
		},
	)
	.refine(
		(data) => {
			// Si Google está habilitado, requiere CLIENT_ID
			if (data.VITE_AUTH_GOOGLE_ENABLED === "true") {
				return data.VITE_AUTH_GOOGLE_CLIENT_ID && data.VITE_AUTH_GOOGLE_CLIENT_ID.trim() !== "";
			}
			return true;
		},
		{
			message: 'VITE_AUTH_GOOGLE_CLIENT_ID es requerido cuando VITE_AUTH_GOOGLE_ENABLED es "true"',
			path: ["VITE_AUTH_GOOGLE_CLIENT_ID"],
		},
	)
	.refine(
		(data) => {
			// Si Google está habilitado, requiere REDIRECT_URI
			if (data.VITE_AUTH_GOOGLE_ENABLED === "true") {
				return data.VITE_AUTH_GOOGLE_REDIRECT_URI && data.VITE_AUTH_GOOGLE_REDIRECT_URI.trim() !== "";
			}
			return true;
		},
		{
			message: 'VITE_AUTH_GOOGLE_REDIRECT_URI es requerido cuando VITE_AUTH_GOOGLE_ENABLED es "true"',
			path: ["VITE_AUTH_GOOGLE_REDIRECT_URI"],
		},
	)
	.refine(
		(data) => {
			// Si Google está habilitado y REDIRECT_URI está presente, debe ser una URL válida
			if (data.VITE_AUTH_GOOGLE_ENABLED === "true" && data.VITE_AUTH_GOOGLE_REDIRECT_URI) {
				try {
					new URL(data.VITE_AUTH_GOOGLE_REDIRECT_URI);
					return true;
				} catch {
					return false;
				}
			}
			return true;
		},
		{
			message: 'VITE_AUTH_GOOGLE_REDIRECT_URI debe ser una URL válida cuando VITE_AUTH_GOOGLE_ENABLED es "true"',
			path: ["VITE_AUTH_GOOGLE_REDIRECT_URI"],
		},
	);

/**
 * Tipo TypeScript inferido del esquema de validación
 */
export type EnvConfig = z.infer<typeof envSchemaWithRefinements>;

/**
 * Función para validar las variables de entorno
 * Lanza un error detallado si alguna variable no cumple con los requisitos
 */
export function validateEnv(): EnvConfig {
	try {
		const result = envSchemaWithRefinements.parse({
			VITE_API_URL: import.meta.env.VITE_API_URL,
			VITE_AUTH_EMAIL_ENABLED: import.meta.env.VITE_AUTH_EMAIL_ENABLED,
			VITE_AUTH_MICROSOFT_ENABLED: import.meta.env.VITE_AUTH_MICROSOFT_ENABLED,
			VITE_AUTH_MICROSOFT_CLIENT_ID: import.meta.env.VITE_AUTH_MICROSOFT_CLIENT_ID,
			VITE_AUTH_MICROSOFT_TENANT_ID: import.meta.env.VITE_AUTH_MICROSOFT_TENANT_ID,
			VITE_AUTH_MICROSOFT_REDIRECT_URI: import.meta.env.VITE_AUTH_MICROSOFT_REDIRECT_URI,
			VITE_AUTH_GOOGLE_ENABLED: import.meta.env.VITE_AUTH_GOOGLE_ENABLED,
			VITE_AUTH_GOOGLE_CLIENT_ID: import.meta.env.VITE_AUTH_GOOGLE_CLIENT_ID,
			VITE_AUTH_GOOGLE_REDIRECT_URI: import.meta.env.VITE_AUTH_GOOGLE_REDIRECT_URI,
			VITE_RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
		});

		return result;
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errorMessages = error.issues.map((err: z.ZodIssue) => {
				const path = err.path.join(".");
				return `  • ${path}: ${err.message}`;
			});

			const errorMessage = [
				"❌ Error de configuración de variables de entorno:",
				"",
				...errorMessages,
				"",
				"📋 Asegúrate de crear un archivo .env en la raíz del proyecto con todas las variables requeridas.",
				"📖 Consulta docs/ENV_EXAMPLE.md para ver ejemplos de configuración.",
			].join("\n");

			// eslint-disable-next-line no-console
			console.error(errorMessage);
			throw new Error("Variables de entorno inválidas o faltantes");
		}
		throw error;
	}
}

/**
 * Variables de entorno validadas y listas para usar
 * Se validan una sola vez al cargar el módulo
 */
let envConfig: EnvConfig | null = null;

export function getEnvConfig(): EnvConfig {
	if (!envConfig) {
		envConfig = validateEnv();
	}
	return envConfig;
}

/**
 * Helper para acceder a configuración específica de autenticación
 */
export function getAuthConfig() {
	const env = getEnvConfig();

	return {
		emailLogin: env.VITE_AUTH_EMAIL_ENABLED === "true",
		microsoft: {
			enabled: env.VITE_AUTH_MICROSOFT_ENABLED === "true",
			clientId: env.VITE_AUTH_MICROSOFT_CLIENT_ID || "",
			tenantId: env.VITE_AUTH_MICROSOFT_TENANT_ID || "",
			redirectUri: env.VITE_AUTH_MICROSOFT_REDIRECT_URI || `${window.location.origin}/auth/callback/microsoft`,
		},
		google: {
			enabled: env.VITE_AUTH_GOOGLE_ENABLED === "true",
			clientId: env.VITE_AUTH_GOOGLE_CLIENT_ID || "",
			redirectUri: env.VITE_AUTH_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/callback/google`,
		},
	};
}

/**
 * Helper para obtener la URL de la API de forma segura
 */
export function getApiUrl(): string {
	const env = getEnvConfig();
	return env.VITE_API_URL;
}

/**
 * Helper para obtener la Site Key de reCAPTCHA v3
 */
export function getRecaptchaSiteKey(): string | undefined {
	const env = getEnvConfig();
	return env.VITE_RECAPTCHA_SITE_KEY;
}
