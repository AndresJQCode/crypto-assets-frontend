import { createFileRoute } from "@tanstack/react-router";
import { PermissionRoute } from "@/components/permissions";
import { ACTIONS } from "@/constants/permissions";
import { DashboardPage } from "@/features/dashboard";
import { PERMISSION_RESOURCES } from "@/types/permissions";

export const Route = createFileRoute("/_admin/dashboard/")({
	component: () => (
		<PermissionRoute resource={PERMISSION_RESOURCES.DASHBOARD} action={ACTIONS.READ}>
			<DashboardPage />
		</PermissionRoute>
	),
});
