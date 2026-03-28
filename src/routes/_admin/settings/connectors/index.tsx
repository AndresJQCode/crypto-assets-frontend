import { createFileRoute } from "@tanstack/react-router";
import { PermissionRoute } from "@/components/permissions";
import { ACTIONS } from "@/constants/permissions";
import { ConnectorsPage } from "@/features/settings/connectors";
import { PERMISSION_RESOURCES } from "@/types/permissions";

export const Route = createFileRoute("/_admin/settings/connectors/")({
	component: () => (
		<PermissionRoute resource={PERMISSION_RESOURCES.CONNECTORS_INSTANCES} action={ACTIONS.READ}>
			<ConnectorsPage />
		</PermissionRoute>
	),
});
