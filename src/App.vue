<script setup lang="ts">
import { useRoute } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { computed, watch } from 'vue';
import { useWebSocketStore } from "@/features/webSocket/useWebSocketStore";
import { useAuthStore } from "@/features/auth/useAuthStore";

const route = useRoute();
const authStore = useAuthStore();
const websocketStore = useWebSocketStore();

const layout = computed<typeof DefaultLayout | typeof AuthLayout>(() => {
  const type = route.meta.layout || 'default';

  return type === 'default'
    ? DefaultLayout
    : AuthLayout;
});

watch(() => authStore.isLoggedIn, (isLoggedIn) => {
  if (isLoggedIn) {
    websocketStore.connect();
    console.info('User authenticated, connecting WebSocket...');
  } else {
    websocketStore.disconnect();
    console.info('User logged out, disconnecting WebSocket...');
  }
}, { immediate: true });
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
