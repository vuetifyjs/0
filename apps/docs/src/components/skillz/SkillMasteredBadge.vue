<script setup lang="ts">
  const {
    showLabel = true,
    iconSize = 14,
  } = defineProps<{
    /** Show the label text */
    showLabel?: boolean
    /** Icon size in pixels */
    iconSize?: number
  }>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1"
    :class="showLabel ? 'text-xs font-semibold px-2 py-0.5 rounded' : ''"
    :style="{
      color: '#ff8000',
      background: showLabel ? 'color-mix(in srgb, #ff8000 15%, transparent)' : undefined,
    }"
    title="You've completed this skill"
  >
    <AppIcon icon="mastered" :size="iconSize" />
    <span v-if="showLabel">Mastered</span>
  </span>
</template>
