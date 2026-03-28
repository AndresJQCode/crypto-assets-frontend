import { buildQueryString } from "@/lib/build-query-string";
import type { PaginatedData } from "@/types/common";
import { endpoints } from "../constants";
import type { ConnectorDefinition, ConnectorDefinitionFilters } from "../types";

export const getConnectorDefinitions = async (
	page = 1,
	limit = 10,
	filters?: ConnectorDefinitionFilters,
): Promise<PaginatedData<ConnectorDefinition>> => {
	const queryParams = {
		page: page.toString(),
		limit: limit.toString(),
		...filters,
	};

	const queryString = buildQueryString(queryParams);
	const response = await fetch(`${endpoints.list()}?${queryString}`);

	if (!response.ok) {
		throw new Error("Error al obtener las definiciones de conectores");
	}

	return response.json();
};
