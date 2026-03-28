import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateItemInAllQueries } from "@/lib/query-helpers";
import { createUser, deleteUser, getUserById, getUsers, toggleUserStatus, updateUser } from "../services";
import type { User, UserFilters } from "../types";

// Hook para obtener lista de usuarios con paginación y filtros
export const useUsers = (page = 1, limit = 10, filters?: UserFilters) => {
	return useQuery({
		queryKey: ["users", page, limit, filters],
		queryFn: () => getUsers(page, limit, filters),
	});
};

// Hook para obtener un usuario por ID
export const useUser = (id: string) => {
	return useQuery({
		queryKey: ["user", id],
		queryFn: () => getUserById(id),
		enabled: !!id,
	});
};

// Hook para paginación infinita de usuarios
export const useInfiniteUsers = (limit = 10, filters?: UserFilters) => {
	return useInfiniteQuery({
		queryKey: ["users-infinite", limit, filters],
		queryFn: ({ pageParam = 1 }) => getUsers(pageParam, limit, filters),
		getNextPageParam: (lastPage) => {
			// Si hay más páginas disponibles, devolver la siguiente página
			return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
		},
		initialPageParam: 1,
		// Asegurar que solo se cargue la primera página inicialmente
		enabled: true,
		// No cargar automáticamente más páginas
		refetchOnWindowFocus: false,
	});
};

// Hook para crear un usuario
export const useCreateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createUser,
		onSuccess: () => {
			// Invalidar las queries relacionadas
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["users-infinite"] });
			queryClient.invalidateQueries({ queryKey: ["user-stats"] });
		},
	});
};

// Hook para actualizar un usuario (incluyendo roles)
export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateUser,
		onSuccess: (data) => {
			// Actualizar ambas queries usando el helper
			updateItemInAllQueries<User>(queryClient, ["users"], ["users-infinite"], data.id, () => data);

			// Invalidar la query del usuario individual
			queryClient.invalidateQueries({ queryKey: ["user", data.id] });
		},
	});
};

// Hook para eliminar un usuario
export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteUser,
		onSuccess: () => {
			// Invalidar las queries relacionadas
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["users-infinite"] });
			queryClient.invalidateQueries({ queryKey: ["user-stats"] });
		},
	});
};

// Hook para obtener un usuario por ID
export const useGetUserById = (userId: string) => {
	return useQuery({
		queryKey: ["user", userId],
		queryFn: () => getUserById(userId),
		enabled: !!userId,
	});
};

// Hook para cambiar estado de usuario (habilitar/inhabilitar)
export const useToggleUserStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => toggleUserStatus(id, isActive),
		onSuccess: (data) => {
			// Actualizar ambas queries usando el helper
			updateItemInAllQueries<User>(queryClient, ["users"], ["users-infinite"], data.id, (user) => ({
				...user,
				isActive: data.isActive,
			}));
		},
	});
};
