import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getContext } from "@/integrations/tanstack-query/query-client";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";
// Validar variables de entorno antes de inicializar la aplicación
import { validateEnv } from "./lib/env";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";
import { logWebVitals } from "./reportWebVitals.ts";

// Validar variables de entorno al inicio de la aplicación
try {
	validateEnv();
	// eslint-disable-next-line no-console
	console.log("✅ Variables de entorno validadas correctamente");
} catch (error) {
	// eslint-disable-next-line no-console
	console.error("❌ Error al validar variables de entorno:", error);
	// Mostrar mensaje de error en la interfaz si las variables no son válidas
	const rootElement = document.getElementById("app");
	if (rootElement) {
		rootElement.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
        font-family: system-ui, -apple-system, sans-serif;
        background-color: #fef2f2;
        color: #991b1b;
      ">
        <div style="
          max-width: 600px;
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #fecaca;
        ">
          <h1 style="margin: 0 0 1rem 0; font-size: 1.5rem; font-weight: bold;">
            🚨 Error de Configuración
          </h1>
          <p style="margin: 0 0 1rem 0; color: #374151;">
            La aplicación no puede iniciarse debido a variables de entorno faltantes o inválidas.
          </p>
          <p style="margin: 0 0 1rem 0; color: #6b7280; font-size: 0.875rem;">
            Por favor, revisa la consola del navegador para ver los detalles específicos del error.
          </p>
          <p style="margin: 0; color: #6b7280; font-size: 0.875rem;">
            Consulta <code style="background: #f3f4f6; padding: 2px 4px; border-radius: 4px;">docs/ENV_EXAMPLE.md</code> para configurar correctamente las variables de entorno.
          </p>
        </div>
      </div>
    `;
	}
	throw error;
}

// Create a new router instance

const TanStackQueryProviderContext = getContext();
const router = createRouter({
	routeTree,
	context: {
		...TanStackQueryProviderContext,
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<ErrorBoundary>
				<TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
					<RouterProvider router={router} />
				</TanStackQueryProvider.Provider>
			</ErrorBoundary>
		</StrictMode>,
	);
}

// Log Web Vitals in development
logWebVitals();
