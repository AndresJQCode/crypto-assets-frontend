import { useState } from "react";

/**
 * Hook para manejar búsqueda en listas
 */
export const useSearch = <T>(items: T[], searchFn: (item: T, searchTerm: string) => boolean) => {
	const [searchInput, setSearchInput] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = () => {
		setSearchTerm(searchInput.trim());
	};

	const clearSearch = () => {
		setSearchInput("");
		setSearchTerm("");
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const filteredItems = searchTerm ? items.filter((item) => searchFn(item, searchTerm)) : items;

	return {
		searchInput,
		setSearchInput,
		searchTerm,
		handleSearch,
		clearSearch,
		handleKeyDown,
		filteredItems,
	};
};
