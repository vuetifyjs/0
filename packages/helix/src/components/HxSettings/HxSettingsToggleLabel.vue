<script setup lang="ts">
  defineOptions({ name: 'HxSettingsToggleLabel' })
</script>

<template>
  <span class="helix-settings-toggle__label">
    <slot />
  </span>
</template>

<style scoped>
  .helix-settings-toggle__label {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
    color: var(--v0-on-surface);
  }
</style>
