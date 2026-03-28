import { getApiUrl } from "@/lib/env";

export const getPermissionsEndpoint = () => `${getApiUrl()}/permissions`;

export const endpoints = {
	permissions: () => getPermissionsEndpoint(),
};
