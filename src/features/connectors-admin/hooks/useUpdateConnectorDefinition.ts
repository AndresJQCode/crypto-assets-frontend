import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateConnectorDefinition } from "../services";

export const useUpdateConnectorDefinition = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateConnectorDefinition,
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["connector-definitions"] });
			queryClient.invalidateQueries({ queryKey: ["connector-definition", data.id] });
		},
	});
};
