<script setup lang="ts">
import { useRoute } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { computed, onMounted, onUnmounted } from 'vue';
import { useWebSocketStore } from "@/features/webSocket/useWebSocketStore";

const route = useRoute();
const websocketStore = useWebSocketStore();

const layout = computed<typeof DefaultLayout | typeof AuthLayout>(() => {
  const type = route.meta.layout || 'default';

  return type === 'default'
    ? DefaultLayout
    : AuthLayout;
});

onMounted(() => {
  websocketStore.connect();
  console.info('WebSocket connected: ', websocketStore.isConnected)
});

onUnmounted(() => {
  websocketStore.disconnect();
  console.info('WebSocket connected: ', websocketStore.isConnected)
});
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
