<script lang="ts">
  export interface CxSettingsSectionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxSettingsSection' })

  defineProps<CxSettingsSectionProps>()
</script>

<template>
  <section class="codex-settings-section">
    <slot />
  </section>
</template>

<style scoped>
  .codex-settings-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
