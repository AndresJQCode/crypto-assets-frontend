/**
 * Constantes compartidas para settings
 * Mensajes de error, textos y constantes reutilizables
 */

export const ERROR_MESSAGES = {
	CREATE_USER: "Error al crear usuario",
	UPDATE_USER: "Error al actualizar usuario",
	DELETE_USER: "Error al eliminar usuario",
	CREATE_ROLE: "Error al crear el rol",
	UPDATE_ROLE: "Error al actualizar rol",
	DELETE_ROLE: "Error al eliminar rol",
	LOAD_USERS: "Error al cargar los usuarios",
	LOAD_USER: "Error al obtener el usuario",
	LOAD_ROLES: "Error al cargar los roles",
	LOAD_ROLE: "Error al obtener el rol",
	GENERIC: "Ha ocurrido un error. Inténtalo de nuevo.",
} as const;

export const SUCCESS_MESSAGES = {
	CREATE_USER: "Usuario creado exitosamente",
	UPDATE_USER: "Usuario actualizado exitosamente",
	DELETE_USER: "Usuario eliminado exitosamente",
	CREATE_ROLE: "Rol creado exitosamente",
	UPDATE_ROLE: "Rol actualizado exitosamente",
	DELETE_ROLE: "Rol eliminado exitosamente",
} as const;

export const PLACEHOLDERS = {
	USER_NAME: "Ingresa el nombre completo",
	USER_EMAIL: "usuario@ejemplo.com",
	ROLE_NAME: "Ej: Administrador, Editor, Usuario",
	ROLE_DESCRIPTION: "Describe las responsabilidades y funciones de este rol (opcional)",
	SEARCH_USERS: "Buscar usuarios por nombre o email...",
	SEARCH_ROLES: "Buscar roles por nombre...",
} as const;

export const LABELS = {
	USER_NAME: "Nombre completo",
	USER_EMAIL: "Correo electrónico",
	ROLE_NAME: "Nombre del rol",
	ROLE_DESCRIPTION: "Descripción del rol (opcional)",
	ROLES: "Roles",
	PERMISSIONS: "Permisos",
	USER_ACTIVE: "Usuario activo",
} as const;

export const DESCRIPTIONS = {
	ADD_USER: "Otorga acceso al sistema a los usuarios enviándoles una invitación por correo electrónico.",
	EDIT_USER: "Modifica la información del usuario y sus roles. Los cambios se aplicarán inmediatamente.",
	ROLES_ASSIGN: "Asigna roles para otorgar acciones de usuario.",
	PERMISSIONS_ASSIGN: "Asigna permisos para otorgar acciones de usuario.",
	EMAIL_CHANGE_WARNING: "Importante: Si se cambia el correo electrónico, puede afectar la sesión actual del usuario.",
} as const;
