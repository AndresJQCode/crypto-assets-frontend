import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disconnectConnector } from "../services";

export const useDisconnectConnector = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => disconnectConnector(id),
		onSuccess: (_data, id) => {
			// Invalidar todas las queries relacionadas con conectores
			queryClient.invalidateQueries({ queryKey: ["connectors"] });
			queryClient.invalidateQueries({ queryKey: ["connector", id] });
		},
	});
};
