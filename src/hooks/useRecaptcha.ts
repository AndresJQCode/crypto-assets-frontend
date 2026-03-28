import { useCallback } from "react";
import { getRecaptchaSiteKey } from "@/lib/env";
import { getRecaptchaEnterpriseToken } from "@/lib/recaptcha-enterprise";

/**
 * Hook para reCAPTCHA Enterprise.
 * Obtiene el token antes de enviar formularios y expone un wrapper para usarlo en submit.
 *
 * Uso directo:
 *   const { getRecaptchaToken } = useRecaptcha();
 *   const token = await getRecaptchaToken('LOGIN');
 *
 * Uso con wrapper (recomendado para formularios):
 *   const { submitWithRecaptcha } = useRecaptcha();
 *   const onSubmit = submitWithRecaptcha('LOGIN', (data) => loginMutation.mutate(data));
 *   // data ya incluye recaptchaToken
 */
export function useRecaptcha() {
	const siteKey = getRecaptchaSiteKey();

	const getRecaptchaToken = useCallback(
		async (action: string): Promise<string | undefined> => {
			if (!siteKey) return undefined;
			return getRecaptchaEnterpriseToken(siteKey, action);
		},
		[siteKey],
	);

	/**
	 * Wrapper para enviar formularios: obtiene el token y llama al callback con los datos + recaptchaToken.
	 * Útil para no repetir la lógica de "get token → add to payload → submit" en cada formulario.
	 *
	 * @param action - Acción reCAPTCHA (ej: 'LOGIN', 'REGISTER', 'FORGOT_PASSWORD')
	 * @param submit - Callback que recibe los datos del form con recaptchaToken ya incluido
	 * @returns Función (formData) => Promise<void> para usar en handleSubmit
	 */
	const submitWithRecaptcha = useCallback(
		<T extends Record<string, unknown>>(action: string, submit: (data: T & { recaptchaToken?: string }) => void) => {
			return async (formData: T) => {
				const recaptchaToken = await getRecaptchaToken(action);
				submit({ ...formData, recaptchaToken });
			};
		},
		[getRecaptchaToken],
	);

	return {
		getRecaptchaToken,
		submitWithRecaptcha,
		isEnabled: !!siteKey,
	};
}
