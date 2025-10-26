import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useTicketStore } from '@/features/tickets/useTicketStore';
import { channelService } from '@/features/channels/service'

export const useWebSocketStore = defineStore('websocket', () => {
  const isConnected = ref(false);

  const connect = (baseUrl: string = 'ws://localhost:3000') => {
    const ticketStore = useTicketStore();

    // WebSocket connection
    const ws = new WebSocket(`${baseUrl}/ws-global`);

    ws.onopen = () => {
      console.log('WebSocket conectado');
      isConnected.value = true;

      // logged user channel
      const channels = channelService.listByStatus("connected");
      const channelId = channels[0].id; //todo ajustar
      ws.send(JSON.stringify({ type: 'joinChannel', channelId }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message:', message);

      // update ticketStore
      switch (message.type) {
        case 'ticketUpdated':
        case 'ticketNewMessage':
          ticketStore.updateTicketInList(message.ticketId, message);
          break;
        case 'newTicketCreated':
          ticketStore.addNewTicket(message.ticket);
          break;
      }
    };

    ws.onclose = () => {
      console.log('WebSocket desconectado');
      isConnected.value = false;
    };
  };

  return {
    isConnected,
    connect
  };
});