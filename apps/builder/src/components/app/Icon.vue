<script setup lang="ts">
  const { path, size = 16 } = defineProps<{
    path: string
    size?: number | string
  }>()
</script>

<template>
  <svg
    aria-hidden="true"
    focusable="false"
    :height="size"
    viewBox="0 0 24 24"
    :width="size"
  >
    <path :d="path" fill="currentColor" />
  </svg>
</template>
