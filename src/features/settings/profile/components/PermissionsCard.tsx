import { Shield } from "lucide-react";
import { memo, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserPermission } from "@/types/permissions";
import { groupUserPermissionsByResource } from "../../shared/utils/permissions";

interface PermissionsCardProps {
	permissions: UserPermission[] | undefined;
}

export const PermissionsCard = memo(function PermissionsCard({ permissions }: PermissionsCardProps) {
	const groupedPermissions = useMemo(() => {
		return permissions ? groupUserPermissionsByResource(permissions) : {};
	}, [permissions]);

	const resourceEntries = Object.entries(groupedPermissions);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Shield className="h-5 w-5" />
					Permisos del rol
				</CardTitle>
				<CardDescription>Permisos que tienes basados en tus roles asignados</CardDescription>
			</CardHeader>
			<CardContent>
				{permissions && permissions.length > 0 ? (
					<div className="space-y-4">
						{resourceEntries.map(([resource, actions], index) => (
							<div key={resource} className="space-y-2">
								<h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
									<Shield className="h-4 w-4" />
									{resource}
								</h4>
								<div className="flex flex-wrap gap-2 ml-6">
									{actions.map((action) => (
										<Badge key={action} variant="outline" className="text-xs">
											{action}
										</Badge>
									))}
								</div>
								{index < resourceEntries.length - 1 && <Separator className="my-3" />}
							</div>
						))}
					</div>
				) : (
					<p className="text-gray-500 italic">No tienes permisos asignados</p>
				)}
			</CardContent>
		</Card>
	);
});
