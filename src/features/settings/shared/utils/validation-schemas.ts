import { z } from "zod";

/**
 * Schemas de validación compartidos
 * Utilidades para validaciones comunes en formularios
 */

/**
 * Validación de email reutilizable
 */
export const emailSchema = z
	.string()
	.refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "El correo electrónico no es válido");

/**
 * Schema base para validación de nombre
 */
export const nameSchema = z.string().min(1, "El nombre es requerido");

/**
 * Schema base para validación de nombre con límite de caracteres
 */
export const nameWithMaxLengthSchema = (maxLength: number) =>
	z.string().min(1, "El nombre es requerido").max(maxLength, `El nombre no puede exceder ${maxLength} caracteres`);

/**
 * Schema base para validación de descripción opcional
 */
export const optionalDescriptionSchema = (maxLength: number) =>
	z.string().max(maxLength, `La descripción no puede exceder ${maxLength} caracteres`).optional().or(z.literal(""));

/**
 * Schema base para validación de array de IDs (roles, permisos, etc.)
 */
export const idsArraySchema = (minItems: number, errorMessage: string) =>
	z.array(z.string()).min(minItems, errorMessage);
