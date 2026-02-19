<script setup>
  defineProps({
    text: { type: String, required: true },
    type: { type: String, default: 'info' },
    time: { type: String, default: '' },
  })

  const typeStyles = {
    info: 'border-l-info',
    success: 'border-l-success',
    warning: 'border-l-warning',
    error: 'border-l-error',
  }
</script>

<template>
  <li
    class="p-3 rounded-lg bg-surface border border-solid border-divider border-l-3 flex items-center justify-between"
    :class="typeStyles[type] || typeStyles.info"
  >
    <span class="text-on-surface font-medium">
      {{ text }}
    </span>

    <span v-if="time" class="text-xs text-on-surface-variant whitespace-nowrap ml-4">
      {{ time }}
    </span>
  </li>
</template>
