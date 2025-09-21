import { defineStore } from 'pinia';
import { ticketService } from './service';
import type { Ticket, Message } from './types';
import { useToast } from 'vue-toastification';

const toast = useToast();

export const useTicketsStore = defineStore('tickets', {
  state: () => ({
    tickets: [] as Ticket[],
    selectedTicketId: null as string | null,
    messages: [] as Message[],
    isLoading: false,
  }),
  
  getters: {
    selectedTicket: (state) => {
      return state.selectedTicketId 
        ? state.tickets.find(t => t.id === state.selectedTicketId) 
        : null;
    },
  },
  
  actions: {
    async fetchTickets() {
      this.isLoading = true;
      try {
        this.tickets = await ticketService.list();
      } catch (error) {
        toast.error('Erro ao carregar os tickets.');
      } finally {
        this.isLoading = false;
      }
    },
    
    async selectTicket(ticketId: string) {
      this.selectedTicketId = ticketId;
      await this.fetchMessages();
    },
    
    async fetchMessages() {
      if (!this.selectedTicketId) return;
      
      this.isLoading = true;
      try {
        this.messages = await ticketService.getChat(this.selectedTicketId);
      } catch (error) {
        toast.error('Erro ao carregar as mensagens.');
      } finally {
        this.isLoading = false;
      }
    },
    
    async sendMessage(content: string) {
      if (!content.trim() || !this.selectedTicketId) return;
      
      this.isLoading = true;
      try {
        const message = await ticketService.sendMessage(this.selectedTicketId, { content });
        this.messages.push(message);
        return message;
      } catch (error) {
        toast.error('Erro ao enviar a mensagem.');
        return null;
      } finally {
        this.isLoading = false;
      }
    },
    
    clearChat() {
      this.selectedTicketId = null;
      this.messages = [];
    }
  },
});