import { Loader2, Search, ShieldPlus } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoles } from "../hooks";
import type { Role } from "../types";
import { RoleListItem } from "./RoleListItem";
import { RoleSkeleton } from "./RoleSkeleton";

interface RoleListProps {
	onAddRole: () => void;
	onEditRole?: (role: Role) => void;
	onDeleteRole?: (role: Role) => void;
	isDeletingRole?: boolean;
	deletingRoleId?: string;
}

export const RoleList: React.FC<RoleListProps> = memo(
	({ onAddRole, onEditRole, onDeleteRole, isDeletingRole = false, deletingRoleId }) => {
		const [searchInput, setSearchInput] = useState("");
		const [searchTerm, setSearchTerm] = useState("");

		// Hook para obtener todos los roles
		const { data: allRoles = [], isLoading, error } = useRoles(true);

		// Filtrar roles del lado del cliente
		const filteredRoles = useMemo(() => {
			if (!searchTerm.trim()) {
				return allRoles;
			}

			const term = searchTerm.toLowerCase();
			return allRoles.filter(
				(role) => role.name.toLowerCase().includes(term) || role.description?.toLowerCase().includes(term),
			);
		}, [allRoles, searchTerm]);

		// Función para realizar la búsqueda
		const handleSearch = () => {
			setSearchTerm(searchInput);
		};

		// Función para limpiar la búsqueda
		const clearSearch = () => {
			setSearchInput("");
			setSearchTerm("");
		};

		// Función para manejar la tecla Enter
		const handleKeyDown = (e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				handleSearch();
			}
		};

		// Mostrar error
		if (error) {
			return (
				<div className="space-y-8">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold">Roles</h3>
						<Button onClick={onAddRole} className="flex items-center gap-2">
							<ShieldPlus className="h-4 w-4" />
							Agregar rol
						</Button>
					</div>
					<div className="bg-red-50 border border-red-200 rounded-lg p-4">
						<p className="text-red-800">Error al cargar los roles: {error.message}</p>
					</div>
				</div>
			);
		}

		return (
			<div className="space-y-8">
				{/* Roles */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<h3 className="text-lg font-semibold">Roles {!isLoading && `(${filteredRoles.length})`}</h3>
							{isLoading && (
								<div className="flex items-center gap-2">
									<Loader2 className="h-4 w-4 animate-spin text-gray-500" />
									<span className="text-sm text-gray-500">Cargando roles...</span>
								</div>
							)}
						</div>
						<Button onClick={onAddRole} className="flex items-center gap-2" disabled={isLoading}>
							<ShieldPlus className="h-4 w-4" />
							Agregar rol
						</Button>
					</div>

					{/* Campo de búsqueda */}
					<div className="flex gap-2">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								type="text"
								placeholder="Buscar roles por nombre..."
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								onKeyDown={handleKeyDown}
								className="pl-10"
								disabled={isLoading}
							/>
						</div>
						<Button onClick={handleSearch} variant="outline" className="flex items-center gap-2" disabled={isLoading}>
							<Search className="h-4 w-4" />
							Buscar
						</Button>
						<Button onClick={clearSearch} variant="outline" className="flex items-center gap-2" disabled={isLoading}>
							Limpiar
						</Button>
					</div>

					<div className="space-y-3">
						{isLoading ? (
							// Mostrar skeletons mientras cargan los roles
							<>
								{[1, 2, 3].map((index) => (
									<RoleSkeleton key={index} />
								))}
								<div className="flex items-center justify-center py-4">
									<div className="flex items-center gap-2">
										<Loader2 className="h-4 w-4 animate-spin text-gray-500" />
										<span className="text-sm text-gray-500">Cargando roles...</span>
									</div>
								</div>
							</>
						) : (
							filteredRoles.map((role) => (
								<RoleListItem
									key={role.id}
									role={role}
									isDeleting={isDeletingRole && deletingRoleId === role.id}
									onEdit={onEditRole}
									onDelete={onDeleteRole}
								/>
							))
						)}
					</div>

					{/* Mensaje cuando no hay roles */}
					{filteredRoles.length === 0 && !isLoading && (
						<div className="text-center py-8">
							{searchTerm ? (
								<div>
									<p className="text-gray-500">No se encontraron roles que coincidan con &quot;{searchTerm}&quot;</p>
								</div>
							) : (
								<p className="text-gray-500">No se encontraron roles</p>
							)}
						</div>
					)}
				</div>
			</div>
		);
	},
);
