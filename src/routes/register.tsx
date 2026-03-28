import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/features/authentication/pages/RegisterPage";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
});
