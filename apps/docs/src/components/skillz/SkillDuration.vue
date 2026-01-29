<script setup lang="ts">
  withDefaults(defineProps<{
    /** Duration in minutes */
    minutes: number
    /** Icon size in pixels */
    iconSize?: number
  }>(), {
    iconSize: 14,
  })
</script>

<template>
  <span class="icon-text font-medium">
    <AppIcon icon="calendar-clock" :size="iconSize" />
    {{ minutes }}m
  </span>
</template>
