<script setup lang="ts">
import { useTicketsStore } from '../useTicketsStore';
import { computed } from 'vue';
import IconLoading from '@/components/Icons/IconLoading.vue';
import IconBack from '@/components/Icons/IconBack.vue';

defineProps<{
  showBackButton?: boolean;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'ticket-selected'): void;
}>();

const ticketsStore = useTicketsStore();

const tickets = computed(() => ticketsStore.tickets);
const selectedTicketId = computed(() => ticketsStore.selectedTicketId);
const isLoading = computed(() => ticketsStore.isLoading);

function handleTicketClick(ticketId: string) {
  ticketsStore.selectTicket(ticketId);
  emit('ticket-selected');
}

function handleBackClick() {
  ticketsStore.clearChat();
  emit('back');
}
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50 border-r border-gray-200">
    <div class="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">Tickets</h2>
      
      <button 
        v-if="showBackButton"
        @click="handleBackClick"
        class="md:hidden p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
      >
        <IconBack />
      </button>
    </div>
    
    <div v-if="isLoading" class="flex-1 flex justify-center items-center">
      <IconLoading class="text-blue-600" />
    </div>
    
    <div v-else-if="tickets.length === 0" class="flex-1 flex justify-center items-center p-4">
      <p class="text-gray-500">Nenhum ticket encontrado.</p>
    </div>
    
    <ul v-else class="flex-1 overflow-y-auto">
      <li 
        v-for="ticket in tickets" 
        :key="ticket.id"
        @click="() => handleTicketClick(ticket.id)"
        class="border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
        :class="{'bg-blue-50': selectedTicketId === ticket.id}"
      >
        <div class="p-4">
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-medium text-gray-900">{{ ticket.title }}</h3>
            <span 
              class="px-2 py-0.5 text-xs rounded-full"
              :class="{
                'bg-green-100 text-green-800': ticket.status === 'open',
                'bg-yellow-100 text-yellow-800': ticket.status === 'pending',
                'bg-gray-100 text-gray-800': ticket.status === 'closed'
              }"
            >
              {{ ticket.status }}
            </span>
          </div>
          
          <div class="flex justify-between text-xs text-gray-500">
            <span>{{ new Date(ticket.createdAt).toLocaleDateString() }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>