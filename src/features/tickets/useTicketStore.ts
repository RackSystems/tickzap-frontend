import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Ticket, Message } from './types';
import apiClient from '@/api/apiClient';
import { handleApiError } from '@/api/handleApiError';

export const useTicketStore = defineStore('tickets', () => {
  const isLoading = ref<boolean>(false);
  const selectedTicketId = ref<string | null>(null);
  const tickets = ref<Ticket[]>([]);
  const messages = ref<Message[]>([]);

  const selectedTicket = computed(() => {
    return selectedTicketId.value
      ? tickets.value.find(t => t.id === selectedTicketId.value)
      : null;
  });

  const fetchTickets = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await apiClient.get('/tickets');
      tickets.value = (response.data.body as Ticket[]) || [];
    } catch (error) {
      handleApiError(error, 'Oops! Ocorreu um erro ao carregar os tickets.');
    } finally {
      isLoading.value = false;
    }
  };

  const fetchMessages = async (): Promise<void> => {
    if (!selectedTicketId.value) return;

    isLoading.value = true;
    try {
      const response = await apiClient.get(`/tickets/${selectedTicketId.value}/chat`);
      messages.value = response.data.body as Message[];
    } catch (error) {
      handleApiError(error, 'Oops! Ocorreu um erro ao carregar as mensagens.');
    } finally {
      isLoading.value = false;
    }
  };

  const selectTicket = async (ticketId: string): Promise<void> => {
    selectedTicketId.value = ticketId;
    await fetchMessages();
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim() || !selectedTicketId.value) return;

    isLoading.value = true;
    try {
      const response = await apiClient.post(`/tickets/${selectedTicketId.value}/chat`, { content });
      messages.value.push(response.data.body as Message);
    } catch (error) {
      handleApiError(error, 'Oops! Ocorreu um erro ao enviar a mensagem.');
    } finally {
      isLoading.value = false;
    }
  };

  const clearChat = (): void => {
    selectedTicketId.value = null;
    messages.value = [];
  };

  return {
    tickets,
    selectedTicketId,
    messages,
    isLoading,
    selectedTicket,
    fetchTickets,
    selectTicket,
    fetchMessages,
    sendMessage,
    clearChat,
  };
});
