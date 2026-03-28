import { createFileRoute } from "@tanstack/react-router";
import { LogoutPage } from "@/features/authentication/pages/LogoutPage";

export const Route = createFileRoute("/logout")({
	component: LogoutPage,
});
