import { z } from "zod";
import { COUNTRY_CODES } from "@/constants/countries";

/**
 * Schema de validación para el formulario de login
 */
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "El email es requerido")
		.refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Formato de email inválido"),
	password: z
		.string()
		.min(1, "La contraseña es requerida")
		.min(8, "La contraseña debe tener al menos 8 caracteres")
		.regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
		.regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
		.regex(/\d/, "La contraseña debe contener al menos un número")
		.regex(/[^a-zA-Z0-9]/, "La contraseña debe contener al menos un carácter especial"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schema de validación para el formulario de registro
 */
/** Solo dígitos; la longitud mínima (9) se valida en el refine. */
const whatsappDigitsOnly = (val: string) => /^\d+$/.test(val.replace(/\s/g, ""));
const whatsappMinDigits = (val: string, min: number) => val.replace(/\s/g, "").length >= min;

export const registerSchema = z
	.object({
		name: z.string().min(1, "El nombre es requerido").min(2, "El nombre debe tener al menos 2 caracteres"),
		tenantName: z.string().min(1, "La empresa es requerida").min(2, "La empresa debe tener al menos 2 caracteres"),
		countryCode: z
			.string()
			.min(1, "Selecciona un país")
			.refine((code) => COUNTRY_CODES.includes(code), "País no válido"),
		whatsappNumber: z
			.string()
			.trim()
			.min(1, "El número de WhatsApp es requerido")
			.refine(whatsappDigitsOnly, "Solo se permiten números y espacios")
			.refine(
				(val) => whatsappMinDigits(val, 9),
				"El número debe contener al menos 9 dígitos (se permiten espacios, ej: 300 123 4567)",
			),
		email: z
			.string()
			.min(1, "El email es requerido")
			.refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Formato de email inválido"),
		password: z
			.string()
			.min(1, "La contraseña es requerida")
			.min(8, "La contraseña debe tener al menos 8 caracteres")
			.regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
			.regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
			.regex(/\d/, "La contraseña debe contener al menos un número")
			.regex(/\W/, "La contraseña debe contener al menos un carácter especial"),
		confirmPassword: z.string().min(1, "Confirma tu contraseña"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Schema de validación para el formulario de recuperación de contraseña
 */
export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, "El email es requerido")
		.refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Formato de email inválido"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Schema de validación para el formulario de restablecimiento de contraseña
 */
export const resetPasswordSchema = z
	.object({
		password: z.string().min(1, "La contraseña es requerida").min(6, "La contraseña debe tener al menos 6 caracteres"),
		confirmPassword: z.string().min(1, "Confirma tu contraseña"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Schema para registro con OAuth (empresa + país + WhatsApp)
 */
export const oauthTenantSchema = z.object({
	tenantName: z.string().min(1, "La empresa es requerida").min(2, "La empresa debe tener al menos 2 caracteres"),
	countryCode: z
		.string()
		.min(1, "Selecciona un país")
		.refine((code) => COUNTRY_CODES.includes(code), "País no válido"),
	whatsappNumber: z
		.string()
		.trim()
		.min(1, "El número de WhatsApp es requerido")
		.refine(whatsappDigitsOnly, "Solo se permiten números y espacios")
		.refine(
			(val) => whatsappMinDigits(val, 9),
			"El número debe contener al menos 9 dígitos (se permiten espacios, ej: 300 123 4567)",
		),
});

export type OAuthTenantFormData = z.infer<typeof oauthTenantSchema>;
