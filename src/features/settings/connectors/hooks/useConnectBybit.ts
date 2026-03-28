import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { connectBybitService } from "../services";
import type { BybitConnectorRequest } from "../types";

export const useConnectBybit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BybitConnectorRequest) => connectBybitService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connectors"] });
      toast.success("Bybit conectado exitosamente");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al conectar Bybit";
      toast.error(message);
    },
  });
};
