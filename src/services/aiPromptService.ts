import api from './api';

export interface AIPrompt {
  id: string;
  gymId: string;
  systemPrompt: string;
  greetingMessage?: string | null;
  qualificationFlow?: any;
  objectionHandling?: any;
  faqs?: any;
  escalationRules?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAIPromptData {
  gymId: string;
  systemPrompt: string;
  greetingMessage?: string;
  qualificationFlow?: any;
  objectionHandling?: any;
  faqs?: any;
  escalationRules?: any;
}

export interface UpdateAIPromptData {
  systemPrompt?: string;
  greetingMessage?: string;
  qualificationFlow?: any;
  objectionHandling?: any;
  faqs?: any;
  escalationRules?: any;
}

/**
 * Get AI prompt for a gym
 */
export const getAIPrompt = async (gymId: string): Promise<AIPrompt> => {
  const response = await api.get(`/ai-prompts/${gymId}`);
  return response.data.data;
};

/**
 * Create AI prompt
 */
export const createAIPrompt = async (data: CreateAIPromptData): Promise<AIPrompt> => {
  const response = await api.post('/ai-prompts', data);
  return response.data.data;
};

/**
 * Update AI prompt
 */
export const updateAIPrompt = async (gymId: string, data: UpdateAIPromptData): Promise<AIPrompt> => {
  const response = await api.put(`/ai-prompts/${gymId}`, data);
  return response.data.data;
};

/**
 * Delete AI prompt
 */
export const deleteAIPrompt = async (gymId: string): Promise<void> => {
  await api.delete(`/ai-prompts/${gymId}`);
};

/**
 * Get default prompt template
 */
export const getDefaultTemplate = async (): Promise<any> => {
  const response = await api.get('/ai-prompts/template');
  return response.data.data;
};
