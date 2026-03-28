import { createFileRoute } from "@tanstack/react-router";
import { PermissionRoute } from "@/components/permissions";
import { ACTIONS, RESOURCES } from "@/constants/permissions";
import { AssetsPage } from "@/features/crypto-assets/pages/AssetsPage";

export const Route = createFileRoute("/_admin/digital-assets/assets/")({
	component: () => (
		<PermissionRoute resource={RESOURCES.DASHBOARD} action={ACTIONS.READ}>
			<AssetsPage />
		</PermissionRoute>
	),
});
