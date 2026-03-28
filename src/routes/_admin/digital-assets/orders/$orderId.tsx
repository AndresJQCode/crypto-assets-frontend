import { createFileRoute } from "@tanstack/react-router";
import { PermissionRoute } from "@/components/permissions";
import { ACTIONS, RESOURCES } from "@/constants/permissions";
import { OrderDetailPage } from "@/features/crypto-assets/pages/OrderDetailPage";

export const Route = createFileRoute("/_admin/digital-assets/orders/$orderId")({
	component: () => (
		<PermissionRoute resource={RESOURCES.DASHBOARD} action={ACTIONS.READ}>
			<OrderDetailPage />
		</PermissionRoute>
	),
});
