<script lang="ts">
  export interface CxAlertContentProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAlertContent' })
</script>

<template>
  <div class="codex-alert__content">
    <slot />
  </div>
</template>

<style scoped>
  .codex-alert__content {
    flex: 1;
    min-width: 0;
  }
</style>
