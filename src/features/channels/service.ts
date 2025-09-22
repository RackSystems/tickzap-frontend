import apiClient from '@/api/apiClient';
import type { Channel } from '@/features/channels/types';
import type { CreateChannelPayload } from '@/features/channels/types';

export const channelService = {
  async list(): Promise<Channel[]> {
    const response = await apiClient.get('/channels');
    return response.data.body;
  },

  async create(payload: CreateChannelPayload): Promise<Channel> {
    const response = await apiClient.post('/channels', payload);
    return response.data.body;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/channels/${id}`);
  },

  async connect(id: string): Promise<any> {
    const response = await apiClient.get(`/channels/${id}/connect`);
    return response.data.body;
  },
};