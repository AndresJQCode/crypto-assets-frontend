// Tipos comunes para reemplazar 'any' en el proyecto

import type { Permission } from "@/types/permissions";
// Tipos para Query Client
export interface QueryData<T = unknown> {
	data: T;
	totalCount?: number;
	page?: number;
	limit?: number;
}

export interface InfiniteQueryData<T = unknown> {
	pages: QueryData<T>[];
	pageParams: (number | string | undefined)[];
}

/**
 * Interfaz genérica para datos paginados
 * @example
 * // Para cualquier tipo de datos
 * const permissions: PaginatedData<Permission> = { ... }
 * const products: PaginatedData<Product> = { ... }
 * const orders: PaginatedData<Order> = { ... }
 *
 * // También se puede usar sin especificar el tipo (usará unknown[])
 * const anyData: PaginatedData = { ... }
 *
 * // Para tipos más específicos
 * const productDetails: PaginatedData<ProductWithDetails> = { ... }
 */
export interface PaginatedData<T = unknown> {
	data: T[];
	totalCount: number;
	totalPages: number;
	limit: number;
	page: number;
}

// Tipos para roles (mantenido aquí por ser usado en múltiples features)
export interface Role {
	id: string;
	name: string;
	description?: string;
	permissions: Permission[];
}

// Tipos para actualizaciones de permisos
export interface PermissionUpdateData {
	id: string;
	isActive: boolean;
}

// Tipos para storage (Redux Persist)
export interface Storage {
	getItem(key: string): Promise<string | null>;
	setItem(key: string, value: string): Promise<void>;
	removeItem(key: string): Promise<void>;
}
