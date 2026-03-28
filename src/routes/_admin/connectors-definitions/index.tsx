import { createFileRoute } from "@tanstack/react-router";
import { PermissionRoute } from "@/components/permissions";
import { ACTIONS } from "@/constants/permissions";
import { ConnectorsAdminPage } from "@/features/connectors-admin";
import { PERMISSION_RESOURCES } from "@/types/permissions";

export const Route = createFileRoute("/_admin/connectors-definitions/")({
	component: () => (
		<PermissionRoute resource={PERMISSION_RESOURCES.CONNECTORS_DEFINITIONS} action={ACTIONS.READ}>
			<ConnectorsAdminPage />
		</PermissionRoute>
	),
});
