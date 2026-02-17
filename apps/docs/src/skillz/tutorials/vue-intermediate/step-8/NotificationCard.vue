<script setup>
  // Utilities
  import { inject, computed } from 'vue'

  const props = defineProps({
    type: { type: String, default: 'info' },
    read: { type: Boolean, default: false },
  })

  const theme = inject('notification-theme', {
    compact: false,
    accentColor: 'info',
  })

  const borderClass = computed(() => {
    const color = theme.accentColor?.value || props.type
    const map = {
      info: 'border-l-info',
      success: 'border-l-success',
      warning: 'border-l-warning',
      error: 'border-l-error',
      primary: 'border-l-primary',
    }
    return map[color] || map.info
  })
</script>

<template>
  <div
    class="rounded-lg border border-solid border-divider border-l-3"
    :class="[
      borderClass,
      read ? 'bg-surface' : 'bg-surface-tint',
      theme.compact?.value ? 'p-2' : 'p-3',
    ]"
  >
    <div :class="theme.compact?.value ? 'mb-1' : 'mb-2'">
      <slot>No notification content</slot>
    </div>

    <div class="flex gap-2">
      <slot name="actions">
        <span class="text-xs text-on-surface-variant">No actions</span>
      </slot>
    </div>
  </div>
</template>
