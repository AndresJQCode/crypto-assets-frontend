import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRole, deleteRole, getRoleById, getRoles, updateRole } from "../services";
import type { Role } from "../types";

// Hook para obtener todos los roles
export const useRoles = (includePermissions = true) => {
	return useQuery({
		queryKey: ["roles", includePermissions],
		queryFn: () => getRoles(includePermissions),
	});
};

// Hook para obtener un rol por ID
export const useRoleById = (id: string, includePermissions = true) => {
	return useQuery({
		queryKey: ["role", id, includePermissions],
		queryFn: () => getRoleById(id, includePermissions),
		enabled: !!id, // Solo ejecutar si hay un ID válido
	});
};

// Hook para crear un rol (incluyendo permisos)
export const useCreateRole = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createRole,
		onSuccess: () => {
			// Invalidar las queries relacionadas
			queryClient.invalidateQueries({ queryKey: ["roles"] });
		},
	});
};

// Hook para actualizar un rol (incluyendo permisos)
export const useUpdateRole = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateRole,
		onSuccess: (data) => {
			// Actualizar la lista de roles
			queryClient.setQueriesData({ queryKey: ["roles"] }, (oldData: Role[] | undefined) => {
				if (!oldData) return oldData;

				return oldData.map((role: Role) => (role.id === data.id ? data : role));
			});

			// Invalidar también las queries específicas del rol
			queryClient.invalidateQueries({ queryKey: ["role", data.id] });
		},
	});
};

// Hook para eliminar un rol
export const useDeleteRole = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteRole,
		onSuccess: () => {
			// Invalidar las queries relacionadas
			queryClient.invalidateQueries({ queryKey: ["roles"] });
		},
	});
};
