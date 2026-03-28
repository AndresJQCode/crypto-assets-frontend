import { endpoints } from "../constants";
import type { GeneralSettings, GeneralSettingsResponse, UpdateGeneralSettingsDto } from "../types";

export const updateGeneralSettings = async (settings: UpdateGeneralSettingsDto): Promise<GeneralSettings> => {
	const response = await fetch(endpoints.settings(), {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(settings),
	});

	if (!response.ok) {
		throw new Error(`Error updating general settings: ${response.statusText}`);
	}

	const data: GeneralSettingsResponse = await response.json();
	return data.settings;
};
