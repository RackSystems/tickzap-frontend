<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTicketStore } from './useTicketStore';
import TicketList from './components/TicketList.vue';
import ChatPanel from './components/ChatPanel.vue';
import { useRoute, useRouter } from 'vue-router';

const showMobileChat = ref(false);
const ticketsStore = useTicketStore();
const route = useRoute();
const router = useRouter();

function handleBack() {
  showMobileChat.value = false;
  router.push({ name: 'Tickets' });
}

function handleTicketSelected() {
  showMobileChat.value = true;
  if (ticketsStore.selectedTicketId) {
    router.push({
      name: 'TicketChat',
      params: { id: ticketsStore.selectedTicketId },
    });
  }
}

onMounted(async () => {
  await ticketsStore.fetchTickets();

  if (route.params.id) {
    await ticketsStore.selectTicket(route.params.id as string);
    showMobileChat.value = true;
  }
});
</script>

<template>
  <div class="h-full flex flex-col">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Chat de Tickets</h1>

    <div class="flex flex-1 overflow-hidden rounded-lg shadow-lg border border-gray-200">
      <!-- Mobile View Logic -->
<!--      <div class="md:hidden w-full h-full">-->
<!--        &lt;!&ndash; Show ticket list when not viewing a chat &ndash;&gt;-->
<!--        <div v-if="!showMobileChat" class="h-full">-->
<!--          <TicketList @ticket-selected="handleTicketSelected" />-->
<!--        </div>-->

<!--        &lt;!&ndash; Show chat when a ticket is selected &ndash;&gt;-->
<!--        <div v-else class="h-full">-->
<!--          <TicketList-->
<!--            v-if="false"-->
<!--            class="hidden"-->
<!--          />-->
<!--          <ChatPanel-->
<!--            :key="ticketsStore.selectedTicketId ?? undefined"-->
<!--            @back="handleBack"-->
<!--            show-back-button-->
<!--          />-->
<!--        </div>-->
<!--      </div>-->

      <!-- Desktop View (Two columns) -->
      <div class="hidden md:flex w-full h-full">
        <div class="w-80 flex-shrink-0">
          <TicketList />
        </div>

<!--        <div class="flex-1">-->
<!--          <ChatPanel :key="ticketsStore.selectedTicketId ?? undefined" />-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>
