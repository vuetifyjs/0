<script lang="ts">
  export interface CxAlertTitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAlertTitle' })
</script>

<template>
  <div class="codex-alert__title">
    <slot />
  </div>
</template>

<style scoped>
  .codex-alert__title {
    width: 100%;
    font-weight: 600;
  }
</style>
