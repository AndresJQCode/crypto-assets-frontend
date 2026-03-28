import { Edit, Loader2, MoreHorizontal, Trash2 } from "lucide-react";
import { memo } from "react";
import { PermissionButton, PermissionDropdownItem } from "@/components/permissions";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PERMISSIONS } from "@/constants/permissions";
import type { Role } from "../types";
import { getInitials } from "../utils/role-helpers";

interface RoleListItemProps {
	role: Role;
	isDeleting: boolean;
	onEdit?: (role: Role) => void;
	onDelete?: (role: Role) => void;
}

export const RoleListItem = memo(function RoleListItem({ role, isDeleting, onEdit, onDelete }: RoleListItemProps) {
	return (
		<div className={`rounded-lg p-4 bg-white border border-gray-200 ${isDeleting ? "opacity-50" : ""}`}>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
						<span className="font-medium text-sm text-blue-600">{getInitials(role.name)}</span>
					</div>
					<div>
						<div className="flex items-center gap-2">
							<span className="font-medium">{role.name}</span>
						</div>
						{role.description && <p className="text-sm text-gray-600 mt-1">{role.description}</p>}
					</div>
				</div>
				<div className="flex items-center gap-3">
					{isDeleting && (
						<Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
							<Loader2 className="mr-1 h-3 w-3 animate-spin inline" />
							Eliminando...
						</Badge>
					)}
					{role.userCount !== undefined && (
						<Badge variant="outline">
							{role.userCount} {role.userCount === 1 ? "usuario" : "usuarios"}
						</Badge>
					)}
					<Badge variant="outline">
						{role.permissions?.length} {role.permissions?.length === 1 ? "permiso" : "permisos"}
					</Badge>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<PermissionButton
								resource={PERMISSIONS.ROLES_UPDATE.resource}
								action={PERMISSIONS.ROLES_UPDATE.action}
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0"
								fallback={null}
								disabled={isDeleting}
							>
								<MoreHorizontal className="h-4 w-4" />
								<span className="sr-only">Abrir menú de acciones</span>
							</PermissionButton>
						</DropdownMenuTrigger>

						<DropdownMenuContent align="end">
							<PermissionDropdownItem
								resource={PERMISSIONS.ROLES_UPDATE.resource}
								action={PERMISSIONS.ROLES_UPDATE.action}
								onClick={() => onEdit?.(role)}
								className="cursor-pointer"
								disabled={isDeleting}
							>
								<Edit className="mr-2 h-4 w-4" />
								Editar rol
							</PermissionDropdownItem>
							<PermissionDropdownItem
								resource={PERMISSIONS.ROLES_DELETE.resource}
								action={PERMISSIONS.ROLES_DELETE.action}
								onClick={() => onDelete?.(role)}
								className="cursor-pointer text-red-600 focus:text-red-600"
								disabled={isDeleting}
							>
								{isDeleting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Eliminando...
									</>
								) : (
									<>
										<Trash2 className="mr-2 h-4 w-4" />
										Eliminar rol
									</>
								)}
							</PermissionDropdownItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</div>
	);
});
