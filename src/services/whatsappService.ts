import api from './api';

export interface WhatsAppMessage {
  to: string;
  message: string;
  gymId?: string;
}

export interface WhatsAppTemplateMessage {
  to: string;
  templateName: string;
  languageCode?: string;
  parameters?: string[];
  gymId?: string;
}

export interface WhatsAppMediaMessage {
  to: string;
  type: 'image' | 'document' | 'audio' | 'video';
  mediaId: string;
  caption?: string;
  filename?: string;
  gymId?: string;
}

export interface WhatsAppBusinessProfile {
  about: string;
  address: string;
  description: string;
  email: string;
  profile_picture_url: string;
  website: string[];
}

export interface WhatsAppConnectionStatus {
  configured: boolean;
  timestamp: string;
  error?: string;
}

/**
 * Send a text message via WhatsApp
 */
export async function sendTextMessage(data: WhatsAppMessage) {
  const response = await api.post('/whatsapp/send/text', data);
  return response.data;
}

/**
 * Send a template message via WhatsApp
 */
export async function sendTemplateMessage(data: WhatsAppTemplateMessage) {
  const response = await api.post('/whatsapp/send/template', data);
  return response.data;
}

/**
 * Send a media message via WhatsApp
 */
export async function sendMediaMessage(data: WhatsAppMediaMessage) {
  const response = await api.post('/whatsapp/send/media', data);
  return response.data;
}

/**
 * Upload media to WhatsApp
 */
export async function uploadMedia(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/whatsapp/media/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

/**
 * Download media from WhatsApp
 */
export async function downloadMedia(mediaId: string) {
  const response = await api.get(`/whatsapp/media/${mediaId}/download`, {
    responseType: 'blob',
  });
  return response.data;
}

/**
 * Get WhatsApp business profile
 */
export async function getBusinessProfile(): Promise<{ success: boolean; data: WhatsAppBusinessProfile }> {
  const response = await api.get('/whatsapp/profile');
  return response.data;
}

/**
 * Update WhatsApp business profile
 */
export async function updateBusinessProfile(profileData: Partial<WhatsAppBusinessProfile>) {
  const response = await api.put('/whatsapp/profile', { profileData });
  return response.data;
}

/**
 * Test WhatsApp connection
 */
export async function testConnection(): Promise<{ success: boolean; data: WhatsAppConnectionStatus }> {
  const response = await api.get('/whatsapp/test');
  return response.data;
}

/**
 * Get webhook URL for WhatsApp configuration
 */
export function getWebhookUrl(): string {
  const baseUrl = process.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}/api/whatsapp/webhook`;
}

/**
 * Format phone number for WhatsApp (remove spaces, add country code if missing)
 */
export function formatPhoneNumber(phone: string, countryCode: string = '+55'): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it doesn't start with country code, add it
  if (!cleaned.startsWith(countryCode.replace('+', ''))) {
    return `${countryCode}${cleaned}`;
  }
  
  return `+${cleaned}`;
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): boolean {
  // Basic validation for Brazilian phone numbers
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Get WhatsApp message status emoji
 */
export function getMessageStatusEmoji(status: string): string {
  switch (status) {
    case 'sent':
      return '✓';
    case 'delivered':
      return '✓✓';
    case 'read':
      return '✓✓';
    case 'failed':
      return '❌';
    default:
      return '⏳';
  }
}

/**
 * Format message timestamp for display
 */
export function formatMessageTimestamp(timestamp: string | Date): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else {
    return date.toLocaleDateString();
  }
}
