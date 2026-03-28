import { getApiUrl } from "@/lib/env";

export const getProfileEndpoint = () => `${getApiUrl()}/auth/me`;

export const endpoints = {
	me: () => getProfileEndpoint(),
};
