/**
 * Builds a URL query string from an object. Skips undefined, null and empty string values.
 * Array values are appended as multiple params with the same key.
 */
export const buildQueryString = (params: Record<string, unknown>): string => {
	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== "") {
			if (Array.isArray(value)) {
				for (const item of value) {
					searchParams.append(key, item.toString());
				}
			} else {
				searchParams.append(key, value.toString());
			}
		}
	}

	return searchParams.toString();
};
