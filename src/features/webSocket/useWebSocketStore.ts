import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useTicketStore } from '@/features/tickets/useTicketStore';
import { channelService } from '@/features/channels/service';

export const useWebSocketStore = defineStore('websocket', () => {
  const isGlobalConnected = ref(false);
  const isTicketConnected = ref(false);
  const globalWs = ref<WebSocket | null>(null);
  const ticketWs = ref<WebSocket | null>(null);

  const connect = (type: 'global' | 'ticket', baseUrl: string = 'ws://localhost:3000') => {
    const path = type === 'global' ? '/ws-global' : '/ws-ticket';
    let ws = new WebSocket(`${baseUrl}${path}`);

    if (type === 'global') {
      globalWs.value = ws;
    } else {
      ticketWs.value = ws;
    }

    ws.onopen = () => {
      console.log(`WebSocket ${type} conectado`);
      if (type === 'global') {
        isGlobalConnected.value = true;
        channelService.listByStatus("connected").then(channels => {
          channels.forEach(channel => {
            if (channel.id) {
              joinChannel(channel.id);
            }
          });
        });
      } else {
        isTicketConnected.value = true;
      }
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(`WebSocket ${type} message:`, message);
      const ticketStore = useTicketStore();

      if (type === 'global') {
        if (message.type === 'ticketUpdated') {
          ticketStore.fetchTickets();
        }
      } else {
        if (message.type === 'newMessage' && message.ticketId === ticketStore.selectedTicketId) {
          ticketStore.handleNewMessage(message.ticketId, message.message);
        } else if (message.type === 'messageProcessed') {
          console.log(`IA processou mensagem no ticket ${message.ticketId}`);
        }
      }
    };

    ws.onclose = () => {
      console.log(`WebSocket ${type} desconectado`);
      if (type === 'global') {
        isGlobalConnected.value = false;
      } else {
        isTicketConnected.value = false;
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket ${type} error:`, error);
    };
  };

  const disconnect = (type: 'global' | 'ticket') => {
    const ws = type === 'global' ? globalWs.value : ticketWs.value;
    ws?.close();
    console.log('WebSocket disconnected');
  };

  const joinChannel = (channelId: string) => {
    globalWs.value?.send(JSON.stringify({ type: 'joinChannel', channelId }));
    console.log(`Joined global channel ${channelId}`);
  };

  const watchTicket = (ticketId: string) => {
    ticketWs.value?.send(JSON.stringify({ type: 'watchTicket', ticketId }));
    console.log(`Watching ticket ${ticketId}`);
  };

  const unwatchTicket = () => {
    if (ticketWs.value && ticketWs.value.readyState === WebSocket.OPEN) {
      ticketWs.value.send(JSON.stringify({ type: 'unwatchTicket' }));
      console.log('Unwatched ticket');
    }
  };

  return {
    isGlobalConnected,
    isTicketConnected,
    connect,
    disconnect,
    joinChannel,
    watchTicket,
    unwatchTicket,
  };
});