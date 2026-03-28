import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConnectorDefinition } from "../services";

export const useDeleteConnectorDefinition = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteConnectorDefinition,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connector-definitions"] });
		},
	});
};
