<script setup lang="ts">
  // Composables
  import { useThemeToggle } from '@/composables/useThemeToggle'

  const { icon, title, toggle } = useThemeToggle()
</script>

<template>
  <button
    :aria-label="title"
    class="bg-surface-tint text-on-surface-tint pa-1 inline-flex rounded opacity-90 hover:opacity-100 transition-all border cursor-pointer"
    :title="title"
    type="button"
    @click="toggle"
  >
    <AppIcon :icon />
  </button>
</template>
