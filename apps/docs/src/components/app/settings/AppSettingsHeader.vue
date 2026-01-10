<script setup lang="ts">
  defineProps<{
    icon: string
    title: string
  }>()
</script>

<template>
  <h3 class="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-3">
    <AppIcon :icon size="16" />
    <span>{{ title }}</span>
  </h3>
</template>
