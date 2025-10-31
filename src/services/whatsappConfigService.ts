import api from './api';

export interface WhatsAppConfigData {
  gymId: string;
  phoneNumber: string;
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  webhookVerifyToken?: string;
}

export interface WhatsAppConfigResponse {
  id: string;
  phoneNumber: string;
  phoneNumberId: string;
  businessAccountId: string;
  status: string;
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
 * Delete WhatsApp configuration for a gym
 */
export async function deleteWhatsAppConfig(gymId: string): Promise<{ deletedCount: number }> {
  const response = await api.delete(`/whatsapp/config/${gymId}`);
  return response.data.data;
}
