<script setup lang="ts">
  const { icon, label, pressed = false, color, onColor } = defineProps<{
    icon: string
    label: string
    pressed?: boolean
    color: string
    onColor: string
  }>()
</script>

<template>
  <button
    :aria-label="`${label} theme`"
    :aria-pressed="pressed"
    :class="[
      'h-9 w-6 shrink-0 inline-flex items-center justify-center rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
      pressed
        ? 'border-primary ring-2 ring-primary/50 opacity-100'
        : 'opacity-50 hover:opacity-100',
    ]"
    :style="{ backgroundColor: color, color: onColor }"
    :title="label"
    type="button"
  >
    <AppIcon :icon size="14" />
  </button>
</template>
