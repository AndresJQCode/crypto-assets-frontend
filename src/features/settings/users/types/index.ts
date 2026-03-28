// Tipos para la gestión de usuarios

export interface User {
	id: string;
	email: string;
	name: string;
	isActive: boolean;
	roles: UserRole[];
}

export interface UserRole {
	id: string;
	name: string;
	description?: string;
	isActive?: boolean;
}

export interface CreateUser {
	email: string;
	name: string;
	roles: string[]; // IDs de roles
}

export interface UpdateUser {
	id: string;
	email?: string;
	name?: string;
	isActive?: boolean;
	roleIds?: string[]; // IDs de roles
}

export interface UserFilters {
	search?: string;
	isActive?: boolean;
	roleId?: string;
	sortBy?: "name" | "email";
	sortOrder?: "asc" | "desc";
	page?: number;
	limit?: number;
}

export interface UserWithDetails extends User {
	// Campos adicionales si el backend los proporciona
}

export interface ChangePasswordRequest {
	userId: string;
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export interface ResetPasswordRequest {
	userId: string;
	newPassword: string;
	confirmPassword: string;
}

export interface AssignRolesToUserRequest {
	userId: string;
	roleIds: string[];
}

// Tipos para actualizaciones de estado
export interface UserUpdateData {
	id: string;
	name?: string;
	email?: string;
	isActive?: boolean;
	roleIds?: string[];
}
