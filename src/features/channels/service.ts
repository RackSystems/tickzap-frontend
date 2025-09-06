import apiClient from '@/api/apiClient';
import type { Channel } from '@/features/channels/types';
import { handleApiError } from '@/api/handleApiError';
import type { CreateChannelPayload } from '@/features/channels/types';

export const channelService = {
  async list(): Promise<Channel[]> {
    try {
      const response = await apiClient.get('/channels');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Oops! Ocorreu um erro ao tentar obter os canais.');
      return [];
    }
  },

  async create(payload: CreateChannelPayload): Promise<Channel> {
    try {
      const response = await apiClient.post('/channels', payload);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Oops! Ocorreu um erro ao tentar criar o canal.');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/channels/${id}`);
    } catch (error) {
      handleApiError(error, 'Oops! Ocorreu um erro ao tentar excluir o canal.');
      throw error;
    }
  },

  async connect(id: string): Promise<any> {
    try {
      const response = await apiClient.get(`/channels/${id}/connect`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Oops! Ocorreu um erro ao tentar conectar o canal.');
      throw error;
    }
  },
};
