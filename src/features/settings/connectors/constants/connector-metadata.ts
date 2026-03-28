import type { ConnectorType } from "../types";

export interface ConnectorMetadata {
	type: ConnectorType;
	name: string;
	description: string;
	icon: string;
	brandColor: string;
	requiresStoreUrl: boolean;
}

export const CONNECTOR_METADATA: Record<ConnectorType, ConnectorMetadata> = {
	bybit: {
		type: "bybit",
		name: "Bybit",
		description: "Conecta tu cuenta de Bybit para operar en el exchange de criptomonedas.",
		icon: "bybit",
		brandColor: "#f7a600",
		requiresStoreUrl: false,
	},
};

export const getConnectorMetadata = (type: ConnectorType): ConnectorMetadata => {
	return CONNECTOR_METADATA[type];
};

export const getAllConnectorTypes = (): ConnectorType[] => {
	return Object.keys(CONNECTOR_METADATA) as ConnectorType[];
};
