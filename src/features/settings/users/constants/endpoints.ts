import { getApiUrl } from "@/lib/env";

export const getUsersEndpoint = () => `${getApiUrl()}/users`;

export const endpoints = {
	list: () => getUsersEndpoint(),
	byId: (id: string) => `${getUsersEndpoint()}/${id}`,
	status: (id: string) => `${getUsersEndpoint()}/${id}/status`,
	roles: (id: string) => `${getUsersEndpoint()}/${id}/roles`,
};
