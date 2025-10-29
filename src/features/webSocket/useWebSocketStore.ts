import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useTicketStore } from '@/features/tickets/useTicketStore';
import { channelService } from '@/features/channels/service'

export const useWebSocketStore = defineStore('websocket', () => {
  const isConnected = ref(false);
  const ws = ref<WebSocket | null>(null);

  const connect = (baseUrl: string = 'ws://localhost:3000') => {
    console.log("WEBSOCKET CONNECTED")
    const ticketStore = useTicketStore();

    // WebSocket connection
    ws.value = new WebSocket(`${baseUrl}/ws-global`);

    ws.value.onopen = async () => {
      console.log('WebSocket conectado');
      isConnected.value = true;

      // logged user channel
      try {
        const channels = await channelService.listByStatus("connected");
        const channelId = channels[0]?.id; //todo talvez isso mude
        if (channelId) {
          ws.value?.send(JSON.stringify({
            type: 'joinChannel',
            channelId
          }));
        }
        console.log("CANAL ", channelId)
      } catch (error) {
        console.error('Erro ao obter canais conectados:', error);
      }
    };

    ws.value.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message:', message);

      // process diferent websocket events
      switch (message.type) {
        case 'newTicketCreated':
          ticketStore.addNewTicket(message.ticket);
          break;
        case 'newMessage': // specific ticket
          ticketStore.handleNewMessage(message.ticketId, message.message);
          break;
        case 'ticketUpdated': // updated channel - general event
          ticketStore.fetchTickets(); // reload all tickets
          break;
        case 'messageProcessed':
          // IA finish process
          console.log(`IA processou mensagem no ticket ${message.ticketId}`);
          break;
      }
    };

    ws.value.onclose = () => {
      isConnected.value = false;
      console.log('WebSocket desconectado');
    };

    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const disconnect = () => {
    ws.value?.close();
    isConnected.value = false;
    console.log('WebSocket disconnected');
  };

  return {
    isConnected,
    connect,
    disconnect
  };
});