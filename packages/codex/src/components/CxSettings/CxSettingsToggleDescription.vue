<script setup lang="ts">
  defineOptions({ name: 'CxSettingsToggleDescription' })
</script>

<template>
  <span class="codex-settings-toggle__description">
    <slot />
  </span>
</template>

<style scoped>
  .codex-settings-toggle__description {
    font-size: 0.75rem;
    line-height: 1.25;
    opacity: 0.7;
  }
</style>
