import { z } from "zod";

export const updateProfileSchema = z.object({
	name: z
		.string()
		.min(1, "El nombre es requerido")
		.min(2, "El nombre debe tener al menos 2 caracteres")
		.max(100, "El nombre no puede exceder 100 caracteres"),
	email: z
		.string()
		.refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "Ingresa un correo electrónico válido")
		.optional(), // Email es opcional ya que no se puede cambiar
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// Re-exportar el tipo del servicio para compatibilidad
export type { UpdateProfileRequest } from "./services";
