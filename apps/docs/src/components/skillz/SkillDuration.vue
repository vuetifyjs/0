<script setup lang="ts">
  const { minutes, iconSize = 14 } = defineProps<{
    /** Duration in minutes */
    minutes: number
    /** Icon size in pixels */
    iconSize?: number
  }>()
</script>

<template>
  <span class="icon-text font-medium">
    <AppIcon icon="calendar-clock" :size="iconSize" />
    {{ minutes }}m
  </span>
</template>
