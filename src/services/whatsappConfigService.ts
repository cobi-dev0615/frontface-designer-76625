import api from './api';

// Per-Gym WhatsApp Configuration
export interface WhatsAppConfigData {
  gymId: string;
  phoneNumber: string;
  phoneNumberId: string;
  accessToken: string;
}

export interface WhatsAppConfigResponse {
  id: string;
  phoneNumber: string;
  phoneNumberId: string;
  accessToken?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Shared Meta Configuration (applied to all gyms)
export interface WhatsAppMetaConfigData {
  metaBusinessManagerId?: string;
  metaAppId?: string;
  metaAppSecret?: string;
  webhookVerifyToken?: string;
  webhookUrl?: string;
}

export interface WhatsAppMetaConfigResponse {
  id: string;
  metaBusinessManagerId?: string | null;
  metaAppId?: string | null;
  metaAppSecret?: string | null; // Masked (partial)
  webhookVerifyToken?: string | null;
  webhookUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionTestResponse {
  configured: boolean;
  businessProfile?: any;
  error?: string;
}

/**
 * Get WhatsApp configuration for a gym
 */
export async function getWhatsAppConfig(gymId: string): Promise<WhatsAppConfigResponse | null> {
  const response = await api.get(`/whatsapp/config/${gymId}`);
  return response.data.data;
}

/**
 * Create or update WhatsApp configuration for a gym
 */
export async function saveWhatsAppConfig(config: WhatsAppConfigData): Promise<WhatsAppConfigResponse> {
  const response = await api.post('/whatsapp/config', config);
  return response.data.data;
}

/**
 * Test WhatsApp connection for a gym
 */
export async function testWhatsAppConnection(gymId: string): Promise<ConnectionTestResponse> {
  const response = await api.post(`/whatsapp/config/${gymId}/test`);
  return response.data.data;
}

/**
 * Activate WhatsApp configuration for a gym
 */
export async function activateWhatsAppConfig(gymId: string): Promise<WhatsAppConfigResponse> {
  const response = await api.post(`/whatsapp/config/${gymId}/activate`);
  return response.data.data;
}

/**
 * Delete WhatsApp configuration for a gym
 */
export async function deleteWhatsAppConfig(gymId: string): Promise<{ deletedCount: number }> {
  const response = await api.delete(`/whatsapp/config/${gymId}`);
  return response.data.data;
}

/**
 * Get WhatsApp Meta configuration (shared settings)
 */
export async function getWhatsAppMetaConfig(): Promise<WhatsAppMetaConfigResponse> {
  const response = await api.get('/whatsapp/meta-config');
  return response.data.data;
}

/**
 * Update WhatsApp Meta configuration (shared settings)
 */
export async function updateWhatsAppMetaConfig(config: WhatsAppMetaConfigData): Promise<WhatsAppMetaConfigResponse> {
  const response = await api.put('/whatsapp/meta-config', config);
  return response.data.data;
}
