import { getApiUrl } from "@/lib/env";

export const getRolesEndpoint = () => `${getApiUrl()}/roles`;

export const endpoints = {
	list: () => getRolesEndpoint(),
	byId: (id: string) => `${getRolesEndpoint()}/${id}`,
};
