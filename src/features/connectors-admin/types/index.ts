// Tipos para el feature de Connectors Admin (Super Admin CRUD)

export type ConnectorType = "bybit";

export interface ConnectorDefinition {
	id: string;
	name: string;
	type: ConnectorType;
	description: string;
	isActive: boolean;
	logoUrl?: string; // URL del logo subido
	createdAt: string;
	updatedAt: string;
}

// DTOs para operaciones CRUD

export interface CreateConnectorDefinition {
	name: string;
	type: ConnectorType;
	description: string;
	isActive: boolean;
	logo?: File; // Archivo de imagen para subir
}

export interface UpdateConnectorDefinition {
	id: string;
	name?: string;
	type?: ConnectorType;
	description?: string;
	isActive?: boolean;
	logo?: File; // Archivo de imagen para subir
}

// Filtros para búsqueda
export interface ConnectorDefinitionFilters {
	search?: string;
	type?: ConnectorType;
	isActive?: boolean;
	sortBy?: "name" | "type" | "createdAt";
	sortOrder?: "asc" | "desc";
}

// Opciones para selects
export const CONNECTOR_TYPE_OPTIONS: { value: ConnectorType; label: string }[] = [
	{ value: "bybit", label: "Bybit" },
];
