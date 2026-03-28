import { getApiUrl } from "@/lib/env";

export const getDashboardEndpoint = () => `${getApiUrl()}/dashboard`;

export const endpoints = {
	metrics: () => `${getDashboardEndpoint()}/metrics`,
};
