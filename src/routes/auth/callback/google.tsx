import { createFileRoute } from "@tanstack/react-router";
import { AuthCallbackPage } from "@/features/authentication/pages/AuthCallbackPage";

export const Route = createFileRoute("/auth/callback/google")({
	component: () => <AuthCallbackPage provider="google" />,
});
