// Endpoints centralizados para el módulo crypto-assets

import { getApiUrl } from "@/lib/env";

const getCryptoAssetsEndpoint = () => `${getApiUrl()}/crypto-assets`;

export const endpoints = {
	// Assets
	assets: {
		list: (exchangeId: string) => `${getCryptoAssetsEndpoint()}/exchanges/${exchangeId}/assets`,
		balance: (exchangeId: string) => `${getCryptoAssetsEndpoint()}/exchanges/${exchangeId}/balance`,
	},

	// Orders
	orders: {
		list: () => `${getCryptoAssetsEndpoint()}/orders`,
		byId: (orderId: string) => `${getCryptoAssetsEndpoint()}/orders/${orderId}`,
		events: (orderId: string) => `${getCryptoAssetsEndpoint()}/orders/${orderId}/events`,
		trades: (orderId: string) => `${getCryptoAssetsEndpoint()}/orders/${orderId}/trades`,
	},
};
