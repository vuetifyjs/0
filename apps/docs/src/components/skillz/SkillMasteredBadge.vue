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
    class="icon-text text-warning"
    title="You've completed this skill!"
  >
    <AppIcon icon="medal" :size="size" />
  </span>
</template>
