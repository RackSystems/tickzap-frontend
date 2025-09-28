<script setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import { useTicketStore } from '@/features/tickets/useTicketStore.ts';
import { useAuthStore } from '@/features/auth/useAuthStore.ts';
import { formatarData } from '@/utils/date.ts';
import IconLoading from '@/components/Icons/IconLoading.vue';

const ticketStore = useTicketStore();
const authStore = useAuthStore();
const messageContent = ref('');

const messageContainer = ref(null);

watch(() => ticketStore.messages, async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
}, { deep: true });

onMounted(() => {
  ticketStore.fetchTickets();
});

const handleSendMessage = async () => {
  if (messageContent.value.trim()) {
    await ticketStore.sendMessage(messageContent.value);
    messageContent.value = '';
  }
};
</script>
<template>
  <div v-if="ticketStore.isLoading">
    <IconLoading />
  </div>

  <div v-else class="w-96 py-10 justify-center px-6 lg:w-full lg:px-8 h-[60%]">
    <div class="bg-gray-600 overflow-hidden animate-rainbow-glow sm:rounded-lg flex h-full"
         style="min-height: 500px;">
      <!--list tickets-->
      <div class="w-3/12 bg-gray-900 bg-opacity-50 border-r border-gray-700 overflow-y-scroll text-white">
        <ul>
          <li
            v-for="ticket in ticketStore.tickets"
            :key="ticket.id"
            @click="() => ticketStore.selectTicket(ticket.id)"
            :class="(ticketStore.selectedTicketId === ticket.id) ? 'bg-gray-200 bg-opacity-50' : ''"
            class="p-4 text-base leading-6 border-b border-gray-700 transition duration-150 hover:bg-gray-700 hover:bg-opacity-50 hover:cursor-pointer"
          >
            <p class="flex items-center text-gray-200 hover:text-white">
              {{ ticket.title }}
              <span class="ml-2 w-2 h-2 bg-custom-blue rounded-full"></span>
            </p>
          </li>
        </ul>
      </div>

      <!--box message-->
      <div v-if="ticketStore.selectedTicketId"
           class="w-9/12 flex flex-col justify-between h-full bg-gray-800 bg-opacity-70 text-white"
      >
        <div class="flex-grow overflow-y-auto">
          <div ref="messageContainer" class="w-full p-6 flex flex-col">
            <!-- message -->
            <div v-for="message in ticketStore.messages"
                 :key="message.id"
                 class="w-full mb-3 msg-scroll"
                 :class="(message.userId === authStore.user.id) ? 'text-right' : 'text-left'"
            >
              <p v-if="message.userId !== authStore.user.id" class="text-sm text-gray-400 mb-1">
                {{ message.user?.username || 'username' }}
              </p>
              <p class="inline-block p-2 rounded-md"
                 style="max-width: 75%;"
                 :class="(message.userId === authStore.user.id) ? 'bg-cyan-500 bg-opacity-20 text-right text-white' : 'bg-blue-500 bg-opacity-20 text-left text-white'"
              >
                {{ message.content }}
              </p>
              <span class="block mt-1 text-xs text-gray-500">{{ formatarData(message.createdAt) }}</span>
            </div>

            <!-- âncora para scroll -->
            <div ref="scrollAnchor"></div>
          </div>
        </div>

        <!-- send message -->
        <div class="w-full bg-gray-200 bg-opacity-25 p-6 border-t border-gray-200">
          <form @submit.prevent="handleSendMessage" class="flex rounded-md overflow-hidden">
            <input v-model="messageContent" type="text"
                   class="flex-1 px-4 py-2 text-sm text-white bg-gray-700 bg-opacity-40 focus:outline-none focus:ring focus:ring-custom-blue rounded-l-md">
            <button class="bg-custom-blue hover:bg-blue-600 transition px-4 py-2 text-white rounded-r-md">Enviar
            </button>
          </form>
        </div>

      </div>
      <div v-else class="w-9/12 relative">
        <div class="w-full h-full flex items-center justify-center">
          <p class="text-gray-400 text-lg">Selecione um ticket para ver as mensagens.</p>
        </div>
        <div class="absolute inset-0 bg-contain bg-no-repeat bg-center opacity-10"
             style="background-image: url('/images/background-1.jpg');">
        </div>
      </div>
    </div>
  </div>
</template>