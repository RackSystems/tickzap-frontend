import apiClient from '@/api/apiClient';
import { handleApiError } from '@/api/handleApiError';
import type { Ticket, Message, SendMessagePayload } from './types';

export const ticketService = {
  async list(): Promise<Ticket[]> {
    try {
      const response = await apiClient.get('/tickets');
      return response.data;
    } catch (error) {
      handleApiError(error, 'Ocorreu um erro ao carregar os tickets.');
      return [];
    }
  },

  async getChat(ticketId: string): Promise<Message[]> {
    try {
      const response = await apiClient.get(`/tickets/${ticketId}/chat`);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Ocorreu um erro ao carregar as mensagens.');
      return [];
    }
  },

  async sendMessage(ticketId: string, payload: SendMessagePayload): Promise<Message> {
    try {
      const response = await apiClient.post(`/tickets/${ticketId}/chat`, payload);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Ocorreu um erro ao enviar a mensagem.');
      throw error;
    }
  }
};