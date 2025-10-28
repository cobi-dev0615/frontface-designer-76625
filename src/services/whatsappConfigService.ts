import api from './api';

export interface WhatsAppConfigData {
  id?: string;
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

/**
 * Send WhatsApp text message
 */
export async function sendWhatsAppTextMessage(to: string, message: string, gymId: string): Promise<any> {
  const response = await api.post('/whatsapp/send-text', { to, message, gymId });
  return response.data;
}

/**
 * Send WhatsApp template message
 */
export async function sendWhatsAppTemplateMessage(
  to: string, 
  templateName: string, 
  languageCode: string = 'en_US',
  parameters?: string[],
  gymId: string
): Promise<any> {
  const response = await api.post('/whatsapp/send-template', { 
    to, 
    templateName, 
    languageCode, 
    parameters, 
    gymId 
  });
  return response.data;
}

/**
 * Send WhatsApp media message
 */
export async function sendWhatsAppMediaMessage(
  to: string,
  type: 'image' | 'document' | 'audio' | 'video',
  mediaId: string,
  caption?: string,
  filename?: string,
  gymId: string
): Promise<any> {
  const response = await api.post('/whatsapp/send-media', { 
    to, 
    type, 
    mediaId, 
    caption, 
    filename, 
    gymId 
  });
  return response.data;
}
