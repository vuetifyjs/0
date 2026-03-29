<script setup lang="ts">
  defineOptions({ name: 'HxSettingsToggleDescription' })
</script>

<template>
  <span class="helix-settings-toggle__description">
    <slot />
  </span>
</template>

<style scoped>
  .helix-settings-toggle__description {
    font-size: 0.75rem;
    line-height: 1.25;
    color: var(--v0-on-surface-variant);
  }
</style>
