import { createFileRoute } from "@tanstack/react-router";
import { PermissionRoute } from "@/components/permissions";
import { ACTIONS, RESOURCES } from "@/constants/permissions";
import { OpenOrdersPage } from "@/features/crypto-assets";

export const Route = createFileRoute("/_admin/digital-assets/orders-open/")({
	component: () => (
		<PermissionRoute resource={RESOURCES.CRYPTO_ASSETS} action={ACTIONS.READ}>
			<OpenOrdersPage />
		</PermissionRoute>
	),
});
