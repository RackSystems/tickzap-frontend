<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTicketsStore } from './useTicketsStore';
import TicketList from './components/TicketList.vue';
import ChatPanel from './components/ChatPanel.vue';
import { useRoute, useRouter } from 'vue-router';

const showMobileChat = ref(false);
const ticketsStore = useTicketsStore();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  await ticketsStore.fetchTickets();
  
  // If we have an ID in the route, select it
  if (route.params.id) {
    ticketsStore.selectTicket(route.params.id as string);
    showMobileChat.value = true;
  }
});

// Handle back navigation for mobile
function handleBack() {
  showMobileChat.value = false;
  router.push({ name: 'Tickets' });
}

// Watch for changes in selected ticket for mobile navigation
function handleTicketSelected() {
  showMobileChat.value = true;
  if (ticketsStore.selectedTicketId) {
    router.push({
      name: 'TicketChat',
      params: { id: ticketsStore.selectedTicketId }
    });
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Chat de Tickets</h1>
    
    <div class="flex flex-1 overflow-hidden rounded-lg shadow-lg border border-gray-200">
      <!-- Mobile View Logic -->
      <div class="md:hidden w-full h-full">
        <!-- Show ticket list when not viewing a chat -->
        <div v-if="!showMobileChat" class="h-full">
          <TicketList @ticket-selected="handleTicketSelected" />
        </div>
        
        <!-- Show chat when a ticket is selected -->
        <div v-else class="h-full">
          <TicketList 
            v-if="false" 
            class="hidden" 
          />
          <ChatPanel 
            :key="ticketsStore.selectedTicketId" 
            @back="handleBack"
            show-back-button
          />
        </div>
      </div>
      
      <!-- Desktop View (Two columns) -->
      <div class="hidden md:flex w-full h-full">
        <div class="w-80 flex-shrink-0">
          <TicketList />
        </div>
        
        <div class="flex-1">
          <ChatPanel :key="ticketsStore.selectedTicketId" />
        </div>
      </div>
    </div>
  </div>
</template>