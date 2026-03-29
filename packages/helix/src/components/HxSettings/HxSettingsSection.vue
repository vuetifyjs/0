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
  }
</style>
