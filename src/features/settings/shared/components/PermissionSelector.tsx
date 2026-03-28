import { Check, CheckSquare } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useGetPermissions from "@/hooks/useGetPermissions";
import type { Permission } from "@/types/permissions";
import { groupPermissionsByResource } from "../utils/permissions";

interface PermissionSelectorProps {
	selectedPermissionIds: string[];
	onChange: (permissionIds: string[]) => void;
	error?: string;
	disabled?: boolean;
}

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
	selectedPermissionIds,
	onChange,
	error,
	disabled = false,
}) => {
	const { data: permissions, isLoading: isLoadingPermissions } = useGetPermissions();

	// Agrupar permisos por recurso usando helper compartido
	const permissionGroups = useMemo(() => {
		return permissions ? groupPermissionsByResource(permissions) : [];
	}, [permissions]);

	const handlePermissionToggle = (permission: Permission) => {
		if (selectedPermissionIds.includes(permission.id)) {
			onChange(selectedPermissionIds.filter((id) => id !== permission.id));
		} else {
			onChange([...selectedPermissionIds, permission.id]);
		}
	};

	const handleSelectAll = () => {
		if (permissions) {
			const allSelected = permissions.length === selectedPermissionIds.length;
			if (allSelected) {
				onChange([]);
			} else {
				onChange(permissions.map((p) => p.id));
			}
		}
	};

	const handleSelectAllResourcePermissions = (_: string, resourcePermissions: Permission[]) => {
		const selectedResourcePermissions = selectedPermissionIds.filter((id) =>
			resourcePermissions.some((p) => p.id === id),
		);
		const allResourceSelected = resourcePermissions.length === selectedResourcePermissions.length;

		if (allResourceSelected) {
			// Deseleccionar todos los permisos del recurso
			onChange(selectedPermissionIds.filter((id) => !resourcePermissions.some((p) => p.id === id)));
		} else {
			// Seleccionar todos los permisos del recurso
			const otherPermissionIds = selectedPermissionIds.filter((id) => !resourcePermissions.some((p) => p.id === id));
			onChange([...otherPermissionIds, ...resourcePermissions.map((p) => p.id)]);
		}
	};

	const allSelected = permissions ? permissions.length === selectedPermissionIds.length : false;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Label>
					Permisos{" "}
					<span className="text-xs text-gray-500 font-normal">
						({selectedPermissionIds.length} de {permissions ? permissions.length : 0} seleccionados)
					</span>
				</Label>
				{!isLoadingPermissions && permissions && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleSelectAll}
						className="flex items-center gap-2"
						disabled={disabled}
					>
						{allSelected ? (
							<>
								<CheckSquare className="h-4 w-4" />
								Deseleccionar todos
							</>
						) : (
							<>
								<Check className="h-4 w-4" />
								Seleccionar todos
							</>
						)}
					</Button>
				)}
			</div>
			{error && <span className="text-sm text-red-500">{error}</span>}

			{isLoadingPermissions ? (
				<p className="text-sm text-gray-500">Cargando permisos...</p>
			) : (
				<div className="space-y-4">
					{permissionGroups.map((group) => {
						const selectedResourcePermissions = selectedPermissionIds.filter((id) =>
							group.permissions.some((p) => p.id === id),
						);
						const allResourceSelected = group.permissions.length === selectedResourcePermissions.length;

						return (
							<div key={group.resource} className="border rounded-lg p-4">
								<div className="flex items-center justify-between mb-3">
									<h4 className="font-medium text-sm capitalize">{group.resource.replace(/_/g, " ")}</h4>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => handleSelectAllResourcePermissions(group.resource, group.permissions)}
										className="flex items-center gap-1 text-xs"
										disabled={disabled}
									>
										{allResourceSelected ? (
											<>
												<CheckSquare className="h-3 w-3" />
												Deseleccionar
											</>
										) : (
											<>
												<Check className="h-3 w-3" />
												Seleccionar todos
											</>
										)}
									</Button>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
									{group.permissions.map((permission) => {
										const isSelected = selectedPermissionIds.includes(permission.id);
										return (
											<label
												key={permission.id}
												className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50"
											>
												<input
													type="checkbox"
													checked={isSelected}
													onChange={() => handlePermissionToggle(permission)}
													className="rounded border-gray-300"
													disabled={disabled}
												/>
												<span className="text-sm">{permission.name}</span>
											</label>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
