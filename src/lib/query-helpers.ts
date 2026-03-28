import type { QueryClient } from "@tanstack/react-query";
import type { InfiniteQueryData, QueryData } from "@/types";

/**
 * Helper to update a single item in a paginated query
 */
export function updateItemInQuery<T extends { id: string }>(
	queryClient: QueryClient,
	queryKey: string[],
	itemId: string,
	updater: (item: T) => T,
) {
	queryClient.setQueriesData({ queryKey }, (oldData: QueryData<T[]> | undefined) => {
		if (!oldData?.data) return oldData;

		return {
			...oldData,
			data: oldData.data.map((item) => (item.id === itemId ? updater(item) : item)),
		};
	});
}

/**
 * Helper to update a single item in an infinite query
 */
export function updateItemInInfiniteQuery<T extends { id: string }>(
	queryClient: QueryClient,
	queryKey: string[],
	itemId: string,
	updater: (item: T) => T,
) {
	queryClient.setQueriesData({ queryKey }, (oldData: InfiniteQueryData<T[]> | undefined) => {
		if (!oldData?.pages) return oldData;

		return {
			...oldData,
			pages: oldData.pages.map((page) => ({
				...page,
				data: page.data.map((item) => (item.id === itemId ? updater(item) : item)),
			})),
		};
	});
}

/**
 * Helper to update item in both regular and infinite queries
 */
export function updateItemInAllQueries<T extends { id: string }>(
	queryClient: QueryClient,
	regularQueryKey: string[],
	infiniteQueryKey: string[],
	itemId: string,
	updater: (item: T) => T,
) {
	updateItemInQuery(queryClient, regularQueryKey, itemId, updater);
	updateItemInInfiniteQuery(queryClient, infiniteQueryKey, itemId, updater);
}
