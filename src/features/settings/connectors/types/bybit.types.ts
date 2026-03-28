/**
 * Bybit connector types
 */

export interface BybitConnectorRequest {
  name: string;
  apiKey: string;
  apiSecret: string;
  isTestnet: boolean;
}

export interface SyncBybitHistoryRequest {
  connectorInstanceId: string;
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
  symbol?: string; // e.g., "BTCUSDT"
}

export interface SyncBybitHistoryResult {
  totalOrdersFetched: number;
  newOrdersStored: number;
  updatedOrders: number;
  totalApiCalls: number;
  syncStartTime: string;
  syncEndTime: string;
  errors: string[];
}

export interface BybitConnectorFormData {
  name: string;
  apiKey: string;
  apiSecret: string;
  isTestnet: boolean;
}
