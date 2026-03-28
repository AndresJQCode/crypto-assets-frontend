import { useQuery } from "@tanstack/react-query";
import { getConnectorById } from "../services";

export const useConnector = (id: string) => {
	return useQuery({
		queryKey: ["connector", id],
		queryFn: () => getConnectorById(id),
		enabled: !!id,
	});
};
