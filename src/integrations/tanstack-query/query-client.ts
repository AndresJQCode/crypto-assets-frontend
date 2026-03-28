import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api-error";

/** No reintentar cuando el error es 400 (bad request); el resto sí puede retry según failureCount */
const defaultRetry = (failureCount: number, error: unknown): boolean => {
	if (error instanceof ApiError && error.status === 400) return false;
	return failureCount < 1;
};

export function getContext() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000, // 5 minutos
				gcTime: 10 * 60 * 1000, // 10 minutos (garbage collection)
				retry: defaultRetry,
				refetchOnWindowFocus: false,
			},
			mutations: {
				retry: defaultRetry,
			},
		},
	});
	return {
		queryClient,
	};
}
