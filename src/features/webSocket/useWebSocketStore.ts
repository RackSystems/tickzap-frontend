import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useTicketStore } from '@/features/tickets/useTicketStore';
import { channelService } from '@/features/channels/service';
import { useAuthStore } from '@/features/auth/useAuthStore';

export const useWebSocketStore = defineStore('websocket', () => {
  const isConnected = ref(false);
  const ws = ref<WebSocket | null>(null);

  const connect = () => {
    console.log('conectou');
    const authStore = useAuthStore();
    if (!authStore.user?.id) {
      console.error('WebSocket connection failed: User not authenticated or user ID is missing.');
      return;
    }

    const path = `ws://localhost:3000/ws-global?userId=${authStore.user.id}`;

    let ws = new WebSocket(path);

    ws.onopen = () => {
      isConnected.value = true;
      console.log(`WebSocket conectado`);
      channelService.list()
        .then(channels => {
          channels.forEach(channel => {
            console.log(channel)
            joinChannel(channel.id)
          });
        });
    };

    ws.onmessage = (event) => {
      console.log(event.data);
      const message = JSON.parse(event.data);
      console.log(`WebSocket ${type} message:`, message);
      const ticketStore = useTicketStore();

      if (message.type === 'ticketUpdated') {
        ticketStore.fetchTickets();
      }
      if (message.type === 'newMessage' && message.ticketId === ticketStore.selectedTicketId) {
        ticketStore.handleNewMessage(message.ticketId, message.message);
      }
      if (message.type === 'messageProcessed') {
        console.log(`IA processou mensagem no ticket ${message.ticketId}`);
      }
    };

    ws.onclose = () => {
      console.log(`WebSocket desconectado`);
      isConnected.value = false;
    };

    ws.onerror = (error) => console.error(`WebSocket error:`, error);
  };

  const disconnect = () => ws.value.close();

  const joinChannel = (channelId: string) => {
    ws.value?.send(JSON.stringify({ type: 'joinChannel', channelId }));
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
    isConnected,
    connect,
    disconnect,
    joinChannel,
    watchTicket,
    unwatchTicket,
  };
});
