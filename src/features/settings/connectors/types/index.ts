// Tipos para el feature de Connectors (tenant: instancias conectadas)

export type ConnectorType = "bybit";

export type ConnectorStatus = "not_configured" | "configured_enabled" | "configured_disabled" | "pending";

/** Instancia de conector del tenant (conexión configurada por el usuario) */
export interface ConnectorInstance {
	id: string;
	type: ConnectorType;
	name: string;
	status: ConnectorStatus;
	storeUrl?: string;
	storeName?: string;
	connectedAt?: string;
	lastSyncAt?: string;
}

/** Instancia de conector con metadatos adicionales (logo, descripción) */
export interface ConnectorInstanceWithMetadata extends ConnectorInstance {
	logoUrl?: string; // URL del logo
	description?: string;
}

// DTOs para operaciones

export interface InitiateOAuthRequest {
	connectorType: ConnectorType;
	storeUrl?: string; // Requerido para WooCommerce
	callbackUrl: string;
}

export interface InitiateOAuthResponse {
	authorizationUrl: string;
}

export interface ToggleConnectorRequest {
	id: string;
	isEnabled: boolean;
}

export interface OAuthCallbackParams {
	code?: string;
	state?: string;
	error?: string;
	error_description?: string;
}

// Filtros para búsqueda
export interface ConnectorFilters {
	type?: ConnectorType;
	status?: ConnectorStatus;
}

// Re-export Bybit types
export * from './bybit.types';
