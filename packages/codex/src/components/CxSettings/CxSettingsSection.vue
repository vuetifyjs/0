<script lang="ts">
  export interface CxSettingsSectionProps {
    /** Section heading */
    title: string
    /** Optional icon name */
    icon?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxSettingsSection' })

  const { title, icon } = defineProps<CxSettingsSectionProps>()
</script>

<template>
  <section class="codex-settings-section">
    <header class="codex-settings-section__header">
      <span v-if="icon" class="codex-settings-section__icon">
        <slot name="icon" />
      </span>

      <h3 class="codex-settings-section__title">{{ title }}</h3>
    </header>

    <div class="codex-settings-section__content">
      <slot />
    </div>
  </section>
</template>

<style scoped>
  .codex-settings-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .codex-settings-section__header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .codex-settings-section__icon {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  .codex-settings-section__title {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25;
  }

  .codex-settings-section__content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
