import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getGeneralSettings, updateGeneralSettings } from "../services";
import type { UpdateGeneralSettingsDto } from "../types";

/**
 * Hook to fetch general settings from the backend
 */
export const useGetGeneralSettings = () => {
	return useQuery({
		queryKey: ["generalSettings"],
		queryFn: getGeneralSettings,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

/**
 * Hook to update general settings in the backend
 */
export const useUpdateGeneralSettings = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (settings: UpdateGeneralSettingsDto) => updateGeneralSettings(settings),
		onSuccess: (updatedSettings) => {
			// Update the cache with the new settings
			queryClient.setQueryData(["generalSettings"], updatedSettings);

			toast.success("Configuración actualizada correctamente");
		},
		onError: (error: Error) => {
			console.error("Error updating general settings:", error);
			toast.error("Error al actualizar la configuración");
		},
	});
};
