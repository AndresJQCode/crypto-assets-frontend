import { createFileRoute } from "@tanstack/react-router";
import { AuthInitializer } from "@/components/AuthInitializer";
import { AdminLayout } from "@/components/layouts/AdminLayout";

export const Route = createFileRoute("/_admin")({
	component: () => (
		<>
			<AuthInitializer />
			<AdminLayout />
		</>
	),
});
