<script setup lang="ts">
  defineOptions({ name: 'CxSettingsToggleLabel' })
</script>

<template>
  <span class="codex-settings-toggle__label">
    <slot />
  </span>
</template>

<style scoped>
  .codex-settings-toggle__label {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
  }
</style>
