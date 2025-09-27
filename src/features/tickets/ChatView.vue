<script setup lang="ts">
import { onMounted } from 'vue';
import { useTicketStore } from './useTicketStore';

const ticketsStore = useTicketStore();

onMounted(async () => {
  await ticketsStore.fetchTickets();
});
</script>

<template>

</template>
