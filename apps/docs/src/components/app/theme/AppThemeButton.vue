<script setup lang="ts">
  const { icon, label, active = false, justify = 'center' } = defineProps<{
    icon: string
    label: string
    active?: boolean
    justify?: 'center' | 'start'
  }>()
</script>

<template>
  <button
    :aria-pressed="active"
    :class="[
      'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors border-divider text-on-surface hover:border-primary/50 data-[active]:border-primary data-[active]:bg-primary/10 data-[active]:text-primary',
      justify === 'start' ? 'justify-start' : 'justify-center',
    ]"
    :data-active="active || undefined"
    type="button"
  >
    <AppIcon :icon size="16" />
    <span class="font-medium">{{ label }}</span>
    <slot />
  </button>
</template>
