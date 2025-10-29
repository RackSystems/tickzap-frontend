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

  // WEBSOCKET functions
  const handleNewMessage = (ticketId: string, newMessage: Message) => {
    console.log("ENTROU NO WEBSOCKET - NOVA MENSAGEM")
    // add message to selected chat
    if (selectedTicketId.value === ticketId) {
      messages.value.push(newMessage);
    }

    const ticketIndex = tickets.value.findIndex((t) => t.id === ticketId);
    if (ticketIndex !== -1) {
      // update tickets list
      tickets.value[ticketIndex].lastMessage = newMessage.content;
      tickets.value[ticketIndex].updatedAt = new Date().toISOString();

      // increase count unread messages - except in actual ticket
      if (selectedTicketId.value !== ticketId) {
        tickets.value[ticketIndex].unreadCount =
          (tickets.value[ticketIndex].unreadCount || 0) + 1;
      }
    }
  };

  const addNewTicket = (ticket: Ticket) => {
    console.log("ENTROU NO WEBSOCKET - NOVO TICKET")
    const existingIndex = tickets.value.findIndex((t) => t.id === ticket.id);
    if (existingIndex === -1) {
      tickets.value.unshift(ticket);
    } // add to the beginning of the lis
  };

  // tickets functions
  const fetchTickets = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await apiClient.get('/tickets');
      tickets.value = response.data as Ticket[];
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
      const response = await apiClient.get(`/tickets/${selectedTicketId.value}/messages`);
      messages.value = response.data;
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

  const sendMessage = async (payload: any): Promise<void> => {
    isLoading.value = true;
    try {
      const response = await apiClient.post(`/tickets/messages/send`, payload);
      console.log(response);
      // WebSocket notify when saved message
    } catch (error) {
      handleApiError(error, 'Oops! Ocorreu um erro ao enviar a mensagem.');
    } finally {
      isLoading.value = false;
    }
  };

  const sendMediaMessage = async (formData: FormData): Promise<void> => {
    if (!selectedTicketId.value) return;

    isLoading.value = true;
    try {
      await apiClient.post(`/tickets/messages/send`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      //UI is updated by WebSocket 'newMessage' event
    } catch (error) {
      handleApiError(error, 'Oops! Ocorreu um erro ao enviar a mídia.');
    } finally {
      isLoading.value = false;
    }
  };

  const toggleAI = async (ticketId: string): Promise<any> => {
    isLoading.value = true;
    try {
      const response = await apiClient.patch(`/tickets/${ticketId}/ai`);
      return response.data;
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
    // WebSocket functions
    addNewTicket,
    handleNewMessage,
    // tickets functions
    fetchTickets,
    selectTicket,
    fetchMessages,
    sendMessage,
    sendMediaMessage,
    toggleAI,
    clearChat,
  };
});