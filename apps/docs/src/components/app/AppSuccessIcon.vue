<script setup lang="ts">
  defineProps<{
    size?: string | number
  }>()
</script>

<template>
  <AppIcon
    class="text-success"
    icon="success"
    :size="size ?? 16"
  />
</template>
