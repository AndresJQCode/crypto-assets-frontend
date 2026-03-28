import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { syncBybitHistoryService } from "../services";
import type { SyncBybitHistoryRequest } from "../types";

export const useSyncBybitHistory = () => {
  return useMutation({
    mutationFn: (data: SyncBybitHistoryRequest) => syncBybitHistoryService(data),
    onSuccess: (result) => {
      const duration = Math.round(
        (new Date(result.syncEndTime).getTime() - new Date(result.syncStartTime).getTime()) / 1000
      );
      
      toast.success(
        `Sincronización completada en ${duration}s`,
        {
          description: `${result.newOrdersStored} nuevas órdenes, ${result.updatedOrders} actualizadas`,
        }
      );
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Error al sincronizar historial";
      toast.error(message);
    },
  });
};
