import { endpoints } from "../constants";
import type { GeneralSettings, GeneralSettingsResponse } from "../types";

export const getGeneralSettings = async (): Promise<GeneralSettings> => {
	const response = await fetch(endpoints.settings(), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error(`Error fetching general settings: ${response.statusText}`);
	}

	const data: GeneralSettingsResponse = await response.json();
	return data.settings;
};
