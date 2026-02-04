<script setup lang="ts">
  defineProps<{
    size?: string | number
  }>()
</script>

<template>
  <AppIcon
    class="text-error"
    icon="close"
    :size="size ?? 16"
  />
</template>
