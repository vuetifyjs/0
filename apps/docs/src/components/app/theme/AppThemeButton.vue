<script setup lang="ts">
  const { icon, label, pressed = false } = defineProps<{
    icon: string
    label: string
    pressed?: boolean
  }>()
</script>

<template>
  <button
    :aria-pressed="pressed"
    :class="[
      'flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors',
      pressed
        ? 'border-primary bg-primary/10 text-primary'
        : 'border-divider hover:border-primary/50 text-on-surface',
    ]"
    type="button"
  >
    <AppIcon :icon size="16" />
    <span class="font-medium">{{ label }}</span>
    <slot />
  </button>
</template>
