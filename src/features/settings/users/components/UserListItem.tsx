import { Edit, Loader2, MoreHorizontal, Trash2, UserCheck, UserX } from "lucide-react";
import { memo } from "react";
import { PermissionButton, PermissionDropdownItem } from "@/components/permissions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PERMISSIONS } from "@/constants/permissions";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "../types";
import { getInitials, getStatusColor, getStatusText } from "../utils/user-helpers";

interface UserListItemProps {
	user: User;
	onEditUser?: (user: User) => void;
	onToggleUserStatus?: (user: User) => void;
	onDeleteUser?: (user: User) => void;
	isDeleting?: boolean;
}

export const UserListItem = memo(function UserListItem({
	user,
	onEditUser,
	onToggleUserStatus,
	onDeleteUser,
	isDeleting = false,
}: UserListItemProps) {
	const { user: currentUser } = useAuth();

	const isCurrentUser = user.id === currentUser?.id;

	return (
		<div
			className={`rounded-lg p-4 ${
				isCurrentUser ? "bg-blue-50 border-2 border-blue-200" : "bg-white border border-gray-200"
			} ${isDeleting ? "opacity-50" : ""}`}
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div
						className={`w-10 h-10 rounded-full flex items-center justify-center ${
							isCurrentUser ? "bg-blue-100" : "bg-purple-100"
						}`}
					>
						<span className={`font-medium text-sm ${isCurrentUser ? "text-blue-600" : "text-purple-600"}`}>
							{getInitials(user.name)}
						</span>
					</div>
					<div>
						<div className="flex items-center gap-2">
							<span className="font-medium">{user.name}</span>
							{isCurrentUser && (
								<Badge variant="default" className="bg-blue-600 text-white text-xs">
									Tú
								</Badge>
							)}
						</div>
						<p className="text-sm text-gray-600">{user.email}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					{isDeleting && (
						<Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
							<Loader2 className="mr-1 h-3 w-3 animate-spin inline" />
							Eliminando...
						</Badge>
					)}
					<Badge variant="secondary" className={getStatusColor(user.isActive)}>
						{getStatusText(user.isActive)}
					</Badge>
					<Badge variant="outline">
						{user.roles.length > 0 ? user.roles.map((role) => role.name).join(", ") : "Sin roles"}
					</Badge>
					<PermissionButton
						resource={PERMISSIONS.USERS_UPDATE.resource}
						action={PERMISSIONS.USERS_UPDATE.action}
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0"
						fallback={null}
					>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isDeleting}>
									<MoreHorizontal className="h-4 w-4" />
									<span className="sr-only">Abrir menú de acciones</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<PermissionDropdownItem
									resource={PERMISSIONS.USERS_UPDATE.resource}
									action={PERMISSIONS.USERS_UPDATE.action}
									onClick={() => onEditUser?.(user)}
									className="cursor-pointer"
									disabled={isDeleting}
								>
									<Edit className="mr-2 h-4 w-4" />
									Editar usuario
								</PermissionDropdownItem>
								<PermissionDropdownItem
									resource={PERMISSIONS.USERS_UPDATE.resource}
									action={PERMISSIONS.USERS_UPDATE.action}
									onClick={() => onToggleUserStatus?.(user)}
									className="cursor-pointer"
									disabled={isDeleting}
								>
									{user.isActive ? (
										<>
											<UserX className="mr-2 h-4 w-4" />
											Desactivar usuario
										</>
									) : (
										<>
											<UserCheck className="mr-2 h-4 w-4" />
											Activar usuario
										</>
									)}
								</PermissionDropdownItem>
								<PermissionDropdownItem
									resource={PERMISSIONS.USERS_DELETE.resource}
									action={PERMISSIONS.USERS_DELETE.action}
									onClick={() => onDeleteUser?.(user)}
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
											Eliminar usuario
										</>
									)}
								</PermissionDropdownItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</PermissionButton>
				</div>
			</div>
		</div>
	);
});
