<script setup>
  defineProps({
    type: { type: String, default: 'info' },
    read: { type: Boolean, default: false },
  })

  const typeStyles = {
    info: 'border-l-info',
    success: 'border-l-success',
    warning: 'border-l-warning',
    error: 'border-l-error',
  }
</script>

<template>
  <div
    class="p-3 rounded-lg border border-solid border-divider border-l-3"
    :class="[
      typeStyles[type] || typeStyles.info,
      read ? 'bg-surface' : 'bg-surface-tint',
    ]"
  >
    <div class="mb-2">
      <slot>No notification content</slot>
    </div>

    <div class="flex gap-2">
      <slot name="actions">
        <span class="text-xs text-on-surface-variant">No actions</span>
      </slot>
    </div>
  </div>
</template>
