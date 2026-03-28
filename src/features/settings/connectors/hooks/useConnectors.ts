import { useQuery } from "@tanstack/react-query";
import { getConnectors } from "../services";
import type { ConnectorFilters } from "../types";

export const useConnectors = (filters?: ConnectorFilters) => {
	return useQuery({
		queryKey: ["connectors", filters],
		queryFn: () => getConnectors(filters),
	});
};
