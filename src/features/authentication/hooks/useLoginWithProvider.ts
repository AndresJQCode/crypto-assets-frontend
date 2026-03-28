import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginWithGoogle, loginWithMicrosoft } from "../services";
import type { AuthProvider } from "../types";

export interface LoginWithProviderPayload {
	provider: AuthProvider;
	/** Flujo: login o register; se envía en state para el callback */
	flow: "login" | "register";
	/** Nombre de la empresa; solo para registro con OAuth */
	tenantName?: string;
	/** Nombre del país; solo para registro con OAuth */
	countryName?: string;
	/** Indicativo del país; solo para registro con OAuth */
	countryPhoneCode?: string;
	/** Número de WhatsApp; solo para registro con OAuth (se usará para contactar) */
	whatsappNumber?: string;
}

// Hook para login con proveedores externos
// Nota: Este hook solo inicia el flujo OAuth, el resultado se maneja en el callback
export const useLoginWithProvider = () => {
	return useMutation({
		mutationFn: async (payload: LoginWithProviderPayload) => {
			const provider = payload.provider;
			const isLogin = payload.flow === "login";
			const options = isLogin
				? undefined
				: {
						flow: "register" as const,
						...(payload.tenantName && { tenantName: payload.tenantName }),
						...(payload.countryName && { countryName: payload.countryName }),
						...(payload.countryPhoneCode && { countryPhoneCode: payload.countryPhoneCode }),
						...(payload.whatsappNumber && { whatsappNumber: payload.whatsappNumber }),
					};
			if (provider === "microsoft") {
				await loginWithMicrosoft(options);
			} else if (provider === "google") {
				await loginWithGoogle(options);
			} else {
				throw new Error(`Proveedor ${provider} no soportado`);
			}
		},
		onError: (error) => {
			toast.error("Error en login con proveedor", {
				description: error.message || "Ha ocurrido un error al iniciar sesión con el proveedor. Inténtalo de nuevo.",
			});
		},
	});
};
