import { AlertCircle, RefreshCw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree.
 * Displays a fallback UI instead of crashing the entire app.
 */
export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Log error to console in development
		console.error("ErrorBoundary caught an error:", error, errorInfo);

		// TODO: Send to error tracking service (Sentry, etc.)
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex items-center justify-center min-h-[400px] p-6">
					<Alert variant="destructive" className="max-w-lg">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Algo salió mal</AlertTitle>
						<AlertDescription className="mt-2">
							<p className="mb-4">
								{this.state.error?.message || "Ha ocurrido un error inesperado. Por favor, intenta de nuevo."}
							</p>
							<Button variant="outline" size="sm" onClick={this.handleRetry} className="gap-2">
								<RefreshCw className="h-4 w-4" />
								Reintentar
							</Button>
						</AlertDescription>
					</Alert>
				</div>
			);
		}

		return this.props.children;
	}
}
