import { useQuery } from "@tanstack/react-query";
import { getConnectorDefinitionById } from "../services";

export const useConnectorDefinition = (id: string) => {
	return useQuery({
		queryKey: ["connector-definition", id],
		queryFn: () => getConnectorDefinitionById(id),
		enabled: !!id,
	});
};
