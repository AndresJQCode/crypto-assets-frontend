import { createFileRoute } from "@tanstack/react-router";
import { PermissionRoute } from "@/components/permissions";
import { ACTIONS, RESOURCES } from "@/constants/permissions";
import { OrdersWithTabsPage } from "@/features/crypto-assets";

export const Route = createFileRoute("/_admin/digital-assets/orders/")({
	component: () => (
		<PermissionRoute resource={RESOURCES.DASHBOARD} action={ACTIONS.READ}>
			<OrdersWithTabsPage />
		</PermissionRoute>
	),
});
