import { apiClient } from "@/lib/axios";
import type { BybitConnectorRequest, ConnectorInstance } from "../types";
import { CONNECTORS_ENDPOINTS } from "../constants/endpoints";

/**
 * Connects a Bybit account using API keys
 */
export const connectBybitService = async (
  data: BybitConnectorRequest
): Promise<ConnectorInstance> => {
  const response = await apiClient.post<ConnectorInstance>(
    CONNECTORS_ENDPOINTS.CONNECT_BYBIT,
    data
  );

  return response.data;
};
