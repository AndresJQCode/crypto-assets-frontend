import { getApiUrl } from "@/lib/env";

export const getSettingsEndpoint = () => `${getApiUrl()}/settings`;

export const endpoints = {
	settings: () => getSettingsEndpoint(),
};
