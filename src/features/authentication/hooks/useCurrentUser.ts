import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services";
import type { AuthUser } from "../types";

export const useCurrentUser = () => {
	return useQuery<AuthUser | null>({
		queryKey: ["currentUser"],
		queryFn: getCurrentUser,
		retry: 1,
		refetchOnWindowFocus: true,
	});
};
