import { Shield } from "lucide-react";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RolesCardProps {
	roles: string[] | undefined;
}

export const RolesCard = memo(function RolesCard({ roles }: RolesCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Shield className="h-5 w-5" />
					Roles asignados
				</CardTitle>
				<CardDescription>Los roles que tienes asignados en el sistema</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex flex-wrap gap-2">
					{roles && roles.length > 0 ? (
						roles.map((role) => (
							<Badge key={role} variant="secondary" className="text-sm">
								{role}
							</Badge>
						))
					) : (
						<p className="text-gray-500 italic">No tienes roles asignados</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
});
