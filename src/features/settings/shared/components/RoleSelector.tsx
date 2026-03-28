import { MoreVertical, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRoles } from "@/features/settings/roles/hooks";
import type { Role } from "@/features/settings/roles/types";

interface RoleSelectorProps {
	selectedRoleIds: string[];
	onChange: (roleIds: string[]) => void;
	error?: string;
	disabled?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRoleIds, onChange, error, disabled = false }) => {
	const { data: roles, isLoading: isLoadingRoles } = useRoles();

	// Obtener los roles seleccionados basados en los IDs
	const selectedRoles = roles?.filter((role) => selectedRoleIds.includes(role.id)) || [];

	const handleAddRole = (role: Role) => {
		if (!selectedRoleIds.includes(role.id)) {
			onChange([...selectedRoleIds, role.id]);
		}
	};

	const handleRemoveRole = (roleId: string) => {
		onChange(selectedRoleIds.filter((id) => id !== roleId));
	};

	const availableRoles = roles?.filter((role) => !selectedRoleIds.includes(role.id)) || [];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Roles</CardTitle>
				<p className="text-sm text-gray-600">Asigna roles para otorgar acciones de usuario.</p>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Lista de roles seleccionados */}
					{selectedRoles.length > 0 && (
						<div className="space-y-2">
							{selectedRoles.map((role) => (
								<div
									key={role.id}
									className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50"
								>
									<div className="flex items-center gap-3">
										<div>
											<div className="font-medium text-sm">{role.name}</div>
										</div>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={disabled}>
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() => handleRemoveRole(role.id)}
												className="text-red-600 focus:text-red-600"
											>
												<X className="h-4 w-4 mr-2" />
												Eliminar rol
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							))}
						</div>
					)}

					{/* Botón para agregar roles */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="w-full justify-start text-gray-600 hover:text-gray-900"
								disabled={disabled || isLoadingRoles}
							>
								<Plus className="h-4 w-4 mr-2" />
								Asignar
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-80">
							{roles && roles.length > 0 ? (
								availableRoles.length === 0 ? (
									<div className="p-3 text-center text-gray-500 text-sm">No hay más roles disponibles para asignar</div>
								) : (
									availableRoles.map((role) => (
										<DropdownMenuItem
											key={role.id}
											onClick={() => handleAddRole(role)}
											className="flex flex-col items-start p-3"
										>
											<div className="font-medium">{role.name}</div>
										</DropdownMenuItem>
									))
								)
							) : (
								<DropdownMenuItem disabled>
									{isLoadingRoles ? "Cargando roles..." : "No hay roles disponibles"}
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				{/* Mensaje de error para roles */}
				{error && <p className="text-sm text-red-600 mt-2">{error}</p>}
			</CardContent>
		</Card>
	);
};
