<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/features/auth/useAuthStore';
import type { Message } from '../types';

const props = defineProps<{
  message: Message;
}>();

const authStore = useAuthStore();
const isCurrentUser = computed(() => props.message.userId === authStore.user?.id);

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString();
}
</script>

<template>
  <div 
    class="mb-4"
    :class="isCurrentUser ? 'text-right' : 'text-left'"
  >
    <p 
      v-if="!isCurrentUser && message.user" 
      class="text-sm text-gray-500 mb-1"
    >
      {{ message.user.username }}
    </p>
    
    <div 
      class="inline-block px-4 py-2 rounded-lg max-w-[75%]"
      :class="isCurrentUser 
        ? 'bg-blue-100 text-blue-900' 
        : 'bg-gray-100 text-gray-900'"
    >
      {{ message.content }}
    </div>
    
    <p class="text-xs text-gray-400 mt-1">
      {{ formatDate(message.createdAt) }}
    </p>
  </div>
</template>