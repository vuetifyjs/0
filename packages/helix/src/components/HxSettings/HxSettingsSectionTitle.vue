<script setup lang="ts">
  defineOptions({ name: 'HxSettingsSectionTitle' })
</script>

<template>
  <h3 class="helix-settings-section__title">
    <slot />
  </h3>
</template>

<style scoped>
  .helix-settings-section__title {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25;
  }
</style>
