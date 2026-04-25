<script setup lang="ts">
  const { icon, label, active = false, color, onColor } = defineProps<{
    icon: string
    label: string
    active?: boolean
    color: string
    onColor: string
  }>()
</script>

<template>
  <button
    :aria-label="`${label} theme`"
    :aria-pressed="active"
    class="h-9 w-6 shrink-0 inline-flex items-center justify-center rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background opacity-50 hover:opacity-100 data-[active]:border-primary data-[active]:ring-2 data-[active]:ring-primary/50 data-[active]:opacity-100"
    :data-active="active || undefined"
    :style="{ backgroundColor: color, color: onColor }"
    :title="label"
    type="button"
  >
    <AppIcon :icon size="14" />
  </button>
</template>
