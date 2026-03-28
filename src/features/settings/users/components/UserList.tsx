import { Loader2, Search, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInfiniteUsers } from "../hooks";
import type { User, UserFilters } from "../types";
import { UserListItem } from "./UserListItem";
import { UserSkeleton } from "./UserSkeleton";

interface UserListProps {
	onAddUser: () => void;
	onTransferOwnership?: () => void;
	onEditUser?: (user: User) => void;
	onToggleUserStatus?: (user: User) => void;
	onDeleteUser?: (user: User) => void;
	isDeletingUser?: boolean;
	deletingUserId?: string;
}

export const UserList: React.FC<UserListProps> = ({
	onAddUser,
	onEditUser,
	onToggleUserStatus,
	onDeleteUser,
	isDeletingUser = false,
	deletingUserId,
}) => {
	const [searchInput, setSearchInput] = useState("");
	const [activeFilters, setActiveFilters] = useState<UserFilters>({});
	const [isSearching, setIsSearching] = useState(false);

	// Hook para paginación infinita con filtros del servidor
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteUsers(
		10,
		activeFilters,
	);

	// Combinar todos los usuarios de todas las páginas
	const allUsers = data?.pages.flatMap((page) => page.data) || [];
	const totalCount = data?.pages[0]?.totalCount || 0;

	// Resetear el estado de búsqueda cuando los datos cambien
	useEffect(() => {
		if (isSearching && !isLoading) {
			setIsSearching(false);
		}
	}, [isLoading, isSearching]);

	// Función para manejar la búsqueda del servidor
	const handleSearch = () => {
		const newFilters: UserFilters = {
			...activeFilters,
			search: searchInput.trim() || undefined,
		};
		setIsSearching(true);
		setActiveFilters(newFilters);
	};

	// Función para limpiar la búsqueda
	const handleClearSearch = () => {
		setSearchInput("");
		setIsSearching(true);
		setActiveFilters({});
	};

	// Función para manejar Enter en el input
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
					<h3 className="text-lg font-semibold">Usuarios</h3>
					<Button onClick={onAddUser} className="flex items-center gap-2">
						<UserPlus className="h-4 w-4" />
						Agregar usuario
					</Button>
				</div>
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-800">Error al cargar los usuarios: {error.message}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* Usuarios */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<h3 className="text-lg font-semibold">
							Usuarios {!isLoading && `(${activeFilters.search ? allUsers.length : totalCount})`}
						</h3>
						{isLoading && (
							<div className="flex items-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin text-gray-500" />
								<span className="text-sm text-gray-500">Cargando usuarios...</span>
							</div>
						)}
					</div>
					<Button onClick={onAddUser} className="flex items-center gap-2" disabled={isLoading}>
						<UserPlus className="h-4 w-4" />
						Agregar usuario
					</Button>
				</div>

				{/* Campo de búsqueda */}
				<div className="flex gap-2">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							type="text"
							placeholder="Buscar usuarios por nombre o email..."
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
					<Button
						onClick={handleClearSearch}
						variant="outline"
						className="flex items-center gap-2"
						disabled={isLoading}
					>
						Limpiar
					</Button>
				</div>

				{/* Indicador de carga para búsquedas */}
				{isSearching && !isLoading && (
					<div className="flex items-center justify-center py-4">
						<div className="flex items-center gap-2">
							<Loader2 className="h-4 w-4 animate-spin" />
							<span className="text-sm text-gray-600">Buscando usuarios...</span>
						</div>
					</div>
				)}

				<div className="space-y-3">
					{isLoading ? (
						// Mostrar skeletons mientras cargan los usuarios
						<>
							{[1, 2, 3, 4, 5].map((index) => (
								<UserSkeleton key={index} />
							))}
							<div className="flex items-center justify-center py-4">
								<div className="flex items-center gap-2">
									<Loader2 className="h-4 w-4 animate-spin text-gray-500" />
									<span className="text-sm text-gray-500">Cargando usuarios...</span>
								</div>
							</div>
						</>
					) : (
						!isSearching &&
						allUsers.map((user) => (
							<UserListItem
								key={user.id}
								user={user}
								onEditUser={onEditUser}
								onToggleUserStatus={onToggleUserStatus}
								onDeleteUser={onDeleteUser}
								isDeleting={isDeletingUser && deletingUserId === user.id}
							/>
						))
					)}
				</div>

				{/* Botón para cargar más usuarios */}
				{!isSearching && hasNextPage && (
					<div className="flex justify-center py-4">
						<Button
							onClick={() => fetchNextPage()}
							disabled={isFetchingNextPage}
							variant="outline"
							className="flex items-center gap-2"
						>
							{isFetchingNextPage ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin" />
									Cargando...
								</>
							) : (
								"Cargar más"
							)}
						</Button>
					</div>
				)}

				{/* Mensaje cuando no hay más páginas */}
				{!isSearching && !hasNextPage && allUsers.length > 0 && (
					<div className="text-center py-4">
						<p className="text-sm text-gray-500">Has visto todos los usuarios</p>
					</div>
				)}

				{/* Mensaje cuando no hay usuarios */}
				{!isSearching && allUsers.length === 0 && !isLoading && (
					<div className="text-center py-8">
						{activeFilters.search ? (
							<div>
								<p className="text-gray-500">
									No se encontraron usuarios que coincidan con &quot;{activeFilters.search}&quot;
								</p>
							</div>
						) : (
							<p className="text-gray-500">No se encontraron usuarios</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
