import { apiClient } from "@/lib/axios";
import type { SyncBybitHistoryRequest, SyncBybitHistoryResult } from "../types";
import { CONNECTORS_ENDPOINTS } from "../constants/endpoints";

/**
 * Syncs full trading history from Bybit
 */
export const syncBybitHistoryService = async (
  data: SyncBybitHistoryRequest
): Promise<SyncBybitHistoryResult> => {
  const response = await apiClient.post<SyncBybitHistoryResult>(
    CONNECTORS_ENDPOINTS.SYNC_BYBIT_HISTORY,
    data
  );

  return response.data;
};
