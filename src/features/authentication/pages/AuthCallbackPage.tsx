import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/useAuth";
import { useAuthCallback } from "../hooks";
import type { AuthProvider, AuthProviderFlow } from "../types";

function parseStateFlow(state: string | undefined): AuthProviderFlow {
	if (!state) return "login";
	try {
		const decoded = JSON.parse(decodeURIComponent(state));
		return decoded?.flow === "register" ? "register" : "login";
	} catch {
		return "login";
	}
}

interface AuthCallbackPageProps {
	provider: AuthProvider;
}

export const AuthCallbackPage = ({ provider }: AuthCallbackPageProps) => {
	const navigate = useNavigate();
	const search = useSearch({ from: `/auth/callback/${provider}` }) as {
		code?: string;
		state?: string;
		error?: string;
		error_description?: string;
	};

	const flow = useMemo(() => parseStateFlow(search.state), [search.state]);
	const backRoute = flow === "register" ? ROUTES.REGISTER : ROUTES.LOGIN;
	const backLabel = flow === "register" ? "Volver al registro" : "Volver al inicio de sesión";

	const { isLoading } = useAuth();

	const callbackMutation = useAuthCallback();

	useEffect(() => {
		const code = search.code;
		const error = search.error;
		const errorDescription = search.error_description;

		const fallbackRoute = parseStateFlow(search.state) === "register" ? ROUTES.REGISTER : ROUTES.LOGIN;

		if (error) {
			navigate({
				to: fallbackRoute,
				search: {
					error: errorDescription || `Error de autenticación con ${provider}`,
				},
			});
			return;
		}

		if (code) {
			callbackMutation.mutate({ provider, code, state: search.state });
		} else {
			navigate({
				to: fallbackRoute,
				search: {
					error: "Código de autorización no recibido",
				},
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [provider, search.code, search.state, search.error, search.error_description]);

	const providerNames = {
		microsoft: "Microsoft",
		google: "Google",
	};

	const showError = Boolean(callbackMutation.error);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						{showError ? "Error de autenticación" : "Procesando Autenticación"}
					</CardTitle>
					<CardDescription className="text-center">
						{isLoading && `Iniciando sesión con ${providerNames[provider]}...`}
						{showError &&
							(flow === "register"
								? "No se pudo completar el registro. Inténtalo de nuevo o vuelve al registro."
								: "No se pudo completar el inicio de sesión. Inténtalo de nuevo o vuelve al inicio de sesión.")}
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center space-y-4">
					{isLoading && (
						<>
							<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
							<p className="text-sm text-gray-600">Por favor, espera mientras procesamos tu autenticación...</p>
						</>
					)}

					{showError && (
						<div className="w-full text-center space-y-4">
							<div className="flex items-start gap-2 text-left text-sm bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-4">
								<AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
								<span>{callbackMutation.error?.message ?? "Error desconocido"}</span>
							</div>
							<p className="text-sm text-muted-foreground">
								Si el problema continúa, comprueba que el servidor esté disponible o inténtalo más tarde.
							</p>
							<Button asChild className="w-full sm:w-auto">
								<Link to={backRoute}>{backLabel}</Link>
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};
