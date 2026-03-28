import { useQuery } from "@tanstack/react-query";
import { getConnectorDefinitions } from "../services";
import type { ConnectorDefinitionFilters } from "../types";

export const useConnectorDefinitions = (page = 1, limit = 10, filters?: ConnectorDefinitionFilters) => {
	return useQuery({
		queryKey: ["connector-definitions", page, limit, filters],
		queryFn: () => getConnectorDefinitions(page, limit, filters),
	});
};
