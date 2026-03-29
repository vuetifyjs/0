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
    opacity: 0.7;
  }
</style>
