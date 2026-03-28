import type { UserPermission } from "@/types/permissions";

export interface PermissionsContextType {
	permissions: UserPermission[];
	isLoading: boolean;
	error: Error | null;
	hasPermission: (resource: string, action: string) => boolean;
	hasAnyPermission: (permissions: Array<{ resource: string; action: string }>) => boolean;
	hasAllPermissions: (permissions: Array<{ resource: string; action: string }>) => boolean;
}
