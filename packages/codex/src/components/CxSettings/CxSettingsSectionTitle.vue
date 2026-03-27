<script setup lang="ts">
  defineOptions({ name: 'CxSettingsSectionTitle' })
</script>

<template>
  <h3 class="codex-settings-section__title">
    <slot />
  </h3>
</template>

<style scoped>
  .codex-settings-section__title {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25;
  }
</style>
