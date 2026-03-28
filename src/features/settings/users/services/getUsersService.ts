import { buildQueryString } from "@/lib/build-query-string";
import type { PaginatedData } from "@/types/common";
import { endpoints } from "../constants";
import type { User, UserFilters } from "../types";

export const getUsers = async (page = 1, limit = 10, filters?: UserFilters): Promise<PaginatedData<User>> => {
	const queryParams = {
		page: page.toString(),
		limit: limit.toString(),
		...filters,
	};

	const queryString = buildQueryString(queryParams);
	const response = await fetch(`${endpoints.list()}?${queryString}`);

	if (!response.ok) {
		throw new Error("Error al obtener los usuarios");
	}

	return response.json();
};
