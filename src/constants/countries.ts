/**
 * Lista de países con nombre e indicativo telefónico (reutilizable en toda la app).
 * Código ISO 3166-1 alpha-2, nombre en español, indicativo con +.
 */
export interface CountryOption {
	code: string;
	name: string;
	phoneCode: string;
}

export const COUNTRIES: CountryOption[] = [
	{ code: "CO", name: "Colombia", phoneCode: "+57" },
	{ code: "MX", name: "México", phoneCode: "+52" },
	{ code: "AR", name: "Argentina", phoneCode: "+54" },
	{ code: "PE", name: "Perú", phoneCode: "+51" },
	{ code: "CL", name: "Chile", phoneCode: "+56" },
	{ code: "EC", name: "Ecuador", phoneCode: "+593" },
	{ code: "VE", name: "Venezuela", phoneCode: "+58" },
	{ code: "BO", name: "Bolivia", phoneCode: "+591" },
	{ code: "PY", name: "Paraguay", phoneCode: "+595" },
	{ code: "UY", name: "Uruguay", phoneCode: "+598" },
	{ code: "CR", name: "Costa Rica", phoneCode: "+506" },
	{ code: "PA", name: "Panamá", phoneCode: "+507" },
	{ code: "GT", name: "Guatemala", phoneCode: "+502" },
	{ code: "HN", name: "Honduras", phoneCode: "+504" },
	{ code: "SV", name: "El Salvador", phoneCode: "+503" },
	{ code: "NI", name: "Nicaragua", phoneCode: "+505" },
	{ code: "CU", name: "Cuba", phoneCode: "+53" },
	{ code: "DO", name: "República Dominicana", phoneCode: "+1" },
	{ code: "PR", name: "Puerto Rico", phoneCode: "+1" },
	{ code: "ES", name: "España", phoneCode: "+34" },
	{ code: "US", name: "Estados Unidos", phoneCode: "+1" },
	{ code: "CA", name: "Canadá", phoneCode: "+1" },
	{ code: "BR", name: "Brasil", phoneCode: "+55" },
	{ code: "FR", name: "Francia", phoneCode: "+33" },
	{ code: "DE", name: "Alemania", phoneCode: "+49" },
	{ code: "IT", name: "Italia", phoneCode: "+39" },
	{ code: "GB", name: "Reino Unido", phoneCode: "+44" },
	{ code: "PT", name: "Portugal", phoneCode: "+351" },
	{ code: "NL", name: "Países Bajos", phoneCode: "+31" },
	{ code: "BE", name: "Bélgica", phoneCode: "+32" },
	{ code: "CH", name: "Suiza", phoneCode: "+41" },
	{ code: "AT", name: "Austria", phoneCode: "+43" },
	{ code: "AU", name: "Australia", phoneCode: "+61" },
	{ code: "JP", name: "Japón", phoneCode: "+81" },
	{ code: "CN", name: "China", phoneCode: "+86" },
	{ code: "IN", name: "India", phoneCode: "+91" },
];

/** Códigos de país válidos para validación */
export const COUNTRY_CODES = COUNTRIES.map((c) => c.code);

export const getCountryByCode = (code: string): CountryOption | undefined => COUNTRIES.find((c) => c.code === code);
