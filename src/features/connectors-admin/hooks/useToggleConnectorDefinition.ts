import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleConnectorDefinition } from "../services";

export const useToggleConnectorDefinition = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => toggleConnectorDefinition(id, isActive),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["connector-definitions"] });
			queryClient.invalidateQueries({ queryKey: ["connector-definition", data.id] });
		},
	});
};
