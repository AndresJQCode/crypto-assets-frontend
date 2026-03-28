import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConnectorDefinition } from "../services";

export const useCreateConnectorDefinition = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createConnectorDefinition,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connector-definitions"] });
		},
	});
};
