<script setup lang="ts">
  const {
    size = 18,
  } = defineProps<{
    /** Icon size in pixels */
    size?: number
  }>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1"
    :style="{
      color: '#ff8000',
    }"
    title="You've completed this skill!"
  >
    <AppIcon icon="medal" :size="size" />
  </span>
</template>
