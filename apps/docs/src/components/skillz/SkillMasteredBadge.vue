<script setup lang="ts">
  const {
    size = 18,
  } = defineProps<{
    /** Icon size in pixels */
    size?: number
  }>()
</script>

<template>
  <AppTooltip
    as="span"
    class="icon-text text-warning"
    text="You've completed this skill!"
  >
    <AppIcon icon="medal" :size />
  </AppTooltip>
</template>
