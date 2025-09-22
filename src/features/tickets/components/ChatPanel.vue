<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { useTicketStore } from '../useTicketStore';
import MessageItem from './MessageItem.vue';
import IconLoading from '@/components/Icons/IconLoading.vue';

const ticketsStore = useTicketStore();

defineProps<{
  showBackButton?: boolean;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const message = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const isSubmitting = computed(() => ticketsStore.isLoading);
const messages = computed(() => ticketsStore.messages);
const selectedTicket = computed(() => ticketsStore.selectedTicket);

// Auto-scroll to the latest message when new messages arrive
watch(() => messages.value.length, async () => {
  await nextTick();
  scrollToBottom();
});

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

async function sendMessage() {
  if (!message.value.trim() || isSubmitting.value) return;
  
  await ticketsStore.sendMessage(message.value);
  message.value = '';
  await nextTick();
  scrollToBottom();
}
</script>

<template>
  <div class="flex flex-col h-full bg-white">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
      <button 
        v-if="showBackButton && selectedTicket" 
        @click="emit('back')"
        class="md:hidden mr-2 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <div class="flex-1">
        <h2 v-if="selectedTicket" class="font-semibold text-gray-900">
          {{ selectedTicket.title }}
        </h2>
        <h2 v-else class="font-semibold text-gray-400">
          Selecione um ticket para visualizar o chat
        </h2>
      </div>
    </div>
    
    <!-- Message area -->
    <div 
      ref="messagesContainer"
      class="flex-1 p-4 overflow-y-auto"
    >
      <!-- Loading state -->
      <div 
        v-if="ticketsStore.isLoading && messages.length === 0" 
        class="h-full flex justify-center items-center"
      >
        <IconLoading class="text-blue-600" />
      </div>
      
      <!-- No ticket selected -->
      <div 
        v-else-if="!selectedTicket" 
        class="h-full flex justify-center items-center"
      >
        <p class="text-gray-400">Selecione um ticket para visualizar o chat</p>
      </div>
      
      <!-- No messages -->
      <div 
        v-else-if="messages.length === 0" 
        class="h-full flex justify-center items-center"
      >
        <p class="text-gray-400">Nenhuma mensagem encontrada</p>
      </div>
      
      <!-- Messages list -->
      <template v-else>
        <MessageItem 
          v-for="msg in messages" 
          :key="msg.id" 
          :message="msg" 
        />
      </template>
    </div>
    
    <!-- Message input -->
    <div v-if="selectedTicket" class="p-4 border-t border-gray-200 bg-gray-50">
      <form @submit.prevent="sendMessage" class="flex">
        <textarea
          v-model="message"
          placeholder="Digite sua mensagem..."
          class="flex-1 resize-none border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :disabled="isSubmitting"
          rows="2"
        ></textarea>
        
        <button
          type="submit"
          :disabled="isSubmitting || !message.trim()"
          class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <IconLoading v-if="isSubmitting" class="h-5 w-5" />
          <span v-else>Enviar</span>
        </button>
      </form>
    </div>
  </div>
</template>