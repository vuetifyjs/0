<script setup>
  // Components
  import NotificationCard from './NotificationCard.vue'

  // Utilities
  import { inject } from 'vue'

  defineProps({
    text: { type: String, required: true },
    type: { type: String, default: 'info' },
    read: { type: Boolean, default: false },
    time: { type: String, default: '' },
  })

  defineEmits(['dismiss', 'mark-read'])

  const theme = inject('notification-theme', {
    compact: false,
    accentColor: 'info',
  })
</script>

<template>
  <NotificationCard :read="read" :type="type">
    <div class="flex items-center justify-between">
      <span
        :class="[
          read ? 'text-on-surface-variant' : 'text-on-surface font-medium',
          theme.compact?.value ? 'text-sm' : '',
        ]"
      >
        {{ text }}
      </span>

      <span v-if="time" class="text-xs text-on-surface-variant whitespace-nowrap ml-4">
        {{ time }}
      </span>
    </div>

    <template #actions>
      <button
        v-if="!read"
        class="text-xs px-2 py-1 rounded bg-success text-on-success"
        @click="$emit('mark-read')"
      >
        Mark read
      </button>

      <button
        class="text-xs px-2 py-1 rounded bg-error text-on-error"
        @click="$emit('dismiss')"
      >
        Dismiss
      </button>
    </template>
  </NotificationCard>
</template>
