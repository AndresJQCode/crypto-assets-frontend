import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "@/services/permissions";
import type { PermissionFilters } from "@/types/permissions";

// Hook para obtener permisos con paginación y filtros
export default (page = 1, limit = 10, filters?: PermissionFilters) => {
	return useQuery({
		queryKey: ["permissions", page, limit, filters],
		queryFn: () => getPermissions(),
	});
};
