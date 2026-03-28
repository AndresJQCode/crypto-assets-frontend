import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "@/components/ui/sonner";
import { persistor, store } from "@/redux/store";

export function Provider({
	children,
	queryClient,
}: {
	readonly children: React.ReactNode;
	readonly queryClient: QueryClient;
}) {
	return (
		<ReduxProvider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<QueryClientProvider client={queryClient}>
					{children}
					<Toaster position="bottom-center" richColors closeButton duration={5000} />
				</QueryClientProvider>
			</PersistGate>
		</ReduxProvider>
	);
}
