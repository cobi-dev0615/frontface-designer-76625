import api from './api';

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'AUDIO' | 'VIDEO';
  sender: 'AI' | 'AGENT' | 'CUSTOMER';
  metadata?: any;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  isDeleted: boolean;
}

export interface Conversation {
  id: string;
  leadId: string;
  userId?: string;
  channel: string;
  status: 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  lastMessage?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  lead: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    status: string;
    source: string;
    score: number;
    notes?: string;
    gym: {
      id: string;
      name: string;
    };
  };
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  messages: Message[];
}

export interface ConversationFilters {
  userId?: string;
  leadId?: string;
  gymId?: string;
  status?: string;
  channel?: string;
  limit?: number;
  offset?: number;
}

export interface ConversationStatistics {
  total: number;
  active: number;
  closed: number;
  archived: number;
}

/**
 * Get all conversations
 */
export const getAllConversations = async (filters: ConversationFilters = {}): Promise<{
  success: boolean;
  data: Conversation[];
  pagination: { total: number; limit: number; offset: number; hasMore: boolean };
}> => {
  const response = await api.get('/conversations', { params: filters });
  return response.data;
};

/**
 * Get conversation by ID
 */
export const getConversationById = async (conversationId: string): Promise<{
  success: boolean;
  data: Conversation;
}> => {
  const response = await api.get(`/conversations/${conversationId}`);
  return response.data;
};

/**
 * Create new conversation
 */
export const createConversation = async (data: {
  leadId: string;
  userId?: string;
  channel?: string;
}): Promise<{ success: boolean; data: Conversation; message: string }> => {
  const response = await api.post('/conversations', data);
  return response.data;
};

/**
 * Update conversation
 */
export const updateConversation = async (
  conversationId: string,
  data: {
    userId?: string;
    status?: 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
    channel?: string;
  }
): Promise<{ success: boolean; data: Conversation; message: string }> => {
  const response = await api.put(`/conversations/${conversationId}`, data);
  return response.data;
};

/**
 * Send message in conversation
 */
export const sendMessage = async (
  conversationId: string,
  data: {
    content: string;
    type?: 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'AUDIO' | 'VIDEO';
    sender: 'AI' | 'AGENT' | 'CUSTOMER';
    metadata?: any;
  }
): Promise<{ success: boolean; data: Message; message: string }> => {
  const response = await api.post(`/conversations/${conversationId}/messages`, data);
  return response.data;
};

/**
 * Assign conversation to agent
 */
export const assignToAgent = async (
  conversationId: string,
  userId: string
): Promise<{ success: boolean; data: Conversation; message: string }> => {
  const response = await api.patch(`/conversations/${conversationId}/assign`, { userId });
  return response.data;
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (
  conversationId: string,
  messageIds: string[]
): Promise<{ success: boolean; message: string }> => {
  const response = await api.patch(`/conversations/${conversationId}/read`, { messageIds });
  return response.data;
};

/**
 * Get conversation statistics
 */
export const getConversationStatistics = async (filters: {
  gymId?: string;
  userId?: string;
} = {}): Promise<{ success: boolean; data: ConversationStatistics }> => {
  const response = await api.get('/conversations/statistics', { params: filters });
  return response.data;
};

/**
 * Delete conversation (soft delete)
 */
export const deleteConversation = async (conversationId: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`/conversations/${conversationId}`);
  return response.data;
};

/**
 * Bulk delete conversations (soft delete)
 */
export const bulkDeleteConversations = async (conversationIds: string[]): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete('/conversations/bulk', { data: { conversationIds } });
  return response.data;
};

