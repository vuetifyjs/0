<script setup>
  defineProps({
    text: { type: String, required: true },
    type: { type: String, default: 'info' },
    read: { type: Boolean, default: false },
    time: { type: String, default: '' },
  })

  const emit = defineEmits(['dismiss', 'mark-read'])

  const typeStyles = {
    info: 'border-l-info',
    success: 'border-l-success',
    warning: 'border-l-warning',
    error: 'border-l-error',
  }
</script>

<template>
  <li
    class="p-3 rounded-lg border border-solid border-divider border-l-3"
    :class="[
      typeStyles[type] || typeStyles.info,
      read ? 'bg-surface' : 'bg-surface-tint',
    ]"
  >
    <div class="flex items-center justify-between mb-1">
      <span :class="read ? 'text-on-surface-variant' : 'text-on-surface font-medium'">
        {{ text }}
      </span>

      <span v-if="time" class="text-xs text-on-surface-variant whitespace-nowrap ml-4">
        {{ time }}
      </span>
    </div>

    <div class="flex gap-2">
      <button
        v-if="!read"
        class="text-xs px-2 py-1 rounded bg-success text-on-success"
        @click="emit('mark-read')"
      >
        Mark read
      </button>

      <button
        class="text-xs px-2 py-1 rounded bg-error text-on-error"
        @click="emit('dismiss')"
      >
        Dismiss
      </button>
    </div>
  </li>
</template>
