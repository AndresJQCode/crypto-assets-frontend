import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/features/authentication/pages/ForgotPasswordPage";

export const Route = createFileRoute("/forgot-password")({
	component: ForgotPasswordPage,
});
