import api from './api';

export interface Integration {
  id: string;
  gymId: string;
  type: 'EVO' | 'GOOGLE_ANALYTICS' | 'FACEBOOK_PIXEL' | 'ZAPIER' | 'WEBHOOK' | 'CUSTOM';
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'PENDING';
  config: any;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
  fieldMappings?: FieldMapping[];
  syncHistory?: SyncHistory[];
  gym?: {
    id: string;
    name: string;
  };
}

export interface FieldMapping {
  id: string;
  integrationId: string;
  duxfitField: string;
  externalField: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SyncHistory {
  id: string;
  integrationId: string;
  type: 'MANUAL' | 'AUTO' | 'SCHEDULED';
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  recordsSynced: number;
  duration: number;
  errorMessage?: string;
  metadata?: any;
  startedAt: string;
  completedAt?: string;
}

export interface Webhook {
  id: string;
  gymId: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
  isActive: boolean;
  lastTriggered?: string;
  createdAt: string;
  updatedAt: string;
  webhookLogs?: WebhookLog[];
  gym?: {
    id: string;
    name: string;
  };
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  eventType: string;
  payload: any;
  response?: any;
  statusCode?: number;
  duration?: number;
  error?: string;
  triggeredAt: string;
}

export interface IntegrationStatistics {
  totalIntegrations: number;
  activeIntegrations: number;
  inactiveIntegrations: number;
  lastSyncs: Array<{
    lastSyncAt: string;
    type: string;
  }>;
}

export interface WebhookStatistics {
  totalWebhooks: number;
  activeWebhooks: number;
  inactiveWebhooks: number;
  totalLogs: number;
  recentLogs: number;
  successRate: number;
}

export interface EVOConfig {
  apiUrl: string;
  apiKey: string;
  branchId: string;
  autoSync: boolean;
  bidirectional: boolean;
  syncNotifications: boolean;
  syncInterval: number;
}

export interface SyncResult {
  success: boolean;
  recordsSynced: number;
  duration: number;
  errors: string[];
  newLeads: any[];
  updatedLeads: any[];
}

// General Integration API

/**
 * Get all integrations for a gym
 */
export const getGymIntegrations = async (gymId: string): Promise<{
  success: boolean;
  data: Integration[];
}> => {
  const response = await api.get(`/integrations/gym/${gymId}`);
  return response.data;
};

/**
 * Get integration by ID
 */
export const getIntegrationById = async (integrationId: string): Promise<{
  success: boolean;
  data: Integration;
}> => {
  const response = await api.get(`/integrations/${integrationId}`);
  return response.data;
};

/**
 * Create new integration
 */
export const createIntegration = async (data: {
  gymId: string;
  type: string;
  name: string;
  config: any;
}): Promise<{ success: boolean; data: Integration; message: string }> => {
  const response = await api.post('/integrations', data);
  return response.data;
};

/**
 * Update integration
 */
export const updateIntegration = async (
  integrationId: string,
  data: {
    name?: string;
    status?: string;
    config?: any;
  }
): Promise<{ success: boolean; data: Integration; message: string }> => {
  const response = await api.put(`/integrations/${integrationId}`, data);
  return response.data;
};

/**
 * Delete integration
 */
export const deleteIntegration = async (integrationId: string): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await api.delete(`/integrations/${integrationId}`);
  return response.data;
};

/**
 * Test integration connection
 */
export const testIntegrationConnection = async (integrationId: string): Promise<{
  success: boolean;
  data: { connected: boolean };
  message: string;
}> => {
  const response = await api.post(`/integrations/${integrationId}/test`);
  return response.data;
};

/**
 * Get integration statistics
 */
export const getIntegrationStatistics = async (gymId: string): Promise<{
  success: boolean;
  data: IntegrationStatistics;
}> => {
  const response = await api.get(`/integrations/gym/${gymId}/statistics`);
  return response.data;
};

/**
 * Update field mappings
 */
export const updateFieldMappings = async (
  integrationId: string,
  mappings: Array<{
    duxfitField: string;
    externalField: string;
    isActive: boolean;
  }>
): Promise<{ success: boolean; message: string }> => {
  const response = await api.put(`/integrations/${integrationId}/field-mappings`, { mappings });
  return response.data;
};

// EVO Integration API

/**
 * Create or update EVO integration
 */
export const createOrUpdateEVOIntegration = async (
  gymId: string,
  config: EVOConfig
): Promise<{ success: boolean; data: Integration; message: string }> => {
  const response = await api.post(`/integrations/evo/gym/${gymId}`, config);
  return response.data;
};

/**
 * Sync leads from EVO
 */
export const syncFromEVO = async (
  gymId: string,
  integrationId: string
): Promise<{ success: boolean; data: SyncResult; message: string }> => {
  const response = await api.post(`/integrations/evo/gym/${gymId}/sync/${integrationId}/from`);
  return response.data;
};

/**
 * Sync leads to EVO
 */
export const syncToEVO = async (
  gymId: string,
  integrationId: string
): Promise<{ success: boolean; data: SyncResult; message: string }> => {
  const response = await api.post(`/integrations/evo/gym/${gymId}/sync/${integrationId}/to`);
  return response.data;
};

/**
 * Get EVO sync history
 */
export const getEVOSyncHistory = async (
  integrationId: string,
  limit: number = 50
): Promise<{ success: boolean; data: SyncHistory[] }> => {
  const response = await api.get(`/integrations/evo/${integrationId}/sync-history`, {
    params: { limit }
  });
  return response.data;
};

// Webhook API

/**
 * Get all webhooks for a gym
 */
export const getGymWebhooks = async (gymId: string): Promise<{
  success: boolean;
  data: Webhook[];
}> => {
  const response = await api.get(`/integrations/webhooks/gym/${gymId}`);
  return response.data;
};

/**
 * Create webhook
 */
export const createWebhook = async (data: {
  gymId: string;
  name: string;
  url: string;
  events: string[];
  secret?: string;
}): Promise<{ success: boolean; data: Webhook; message: string }> => {
  const response = await api.post('/integrations/webhooks', data);
  return response.data;
};

/**
 * Update webhook
 */
export const updateWebhook = async (
  webhookId: string,
  data: {
    name?: string;
    url?: string;
    events?: string[];
    secret?: string;
    isActive?: boolean;
  }
): Promise<{ success: boolean; data: Webhook; message: string }> => {
  const response = await api.put(`/integrations/webhooks/${webhookId}`, data);
  return response.data;
};

/**
 * Delete webhook
 */
export const deleteWebhook = async (webhookId: string): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await api.delete(`/integrations/webhooks/${webhookId}`);
  return response.data;
};

/**
 * Test webhook URL
 */
export const testWebhookUrl = async (url: string, secret?: string): Promise<{
  success: boolean;
  data: { valid: boolean };
  message: string;
}> => {
  const response = await api.post('/integrations/webhooks/test-url', { url, secret });
  return response.data;
};

/**
 * Get webhook statistics
 */
export const getWebhookStatistics = async (gymId: string): Promise<{
  success: boolean;
  data: WebhookStatistics;
}> => {
  const response = await api.get(`/integrations/webhooks/gym/${gymId}/statistics`);
  return response.data;
};
