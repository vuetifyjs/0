<script lang="ts">
  export interface HxSettingsSectionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxSettingsSection' })

  defineProps<HxSettingsSectionProps>()
</script>

<template>
  <section class="helix-settings-section">
    <slot />
  </section>
</template>

<style scoped>
  .helix-settings-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--v0-divider);
  }

  .helix-settings-section:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
</style>
