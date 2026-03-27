<script lang="ts">
  // Components
  import { CxSwitch } from '#codex/components/CxSwitch'

  export interface CxSettingsToggleProps {
    /** Toggle label */
    label: string
    /** Optional description text */
    description?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxSettingsToggle' })

  const { label, description } = defineProps<CxSettingsToggleProps>()

  const model = defineModel<boolean>({ required: true })
</script>

<template>
  <div class="codex-settings-toggle">
    <div class="codex-settings-toggle__text">
      <span class="codex-settings-toggle__label">{{ label }}</span>
      <span v-if="description" class="codex-settings-toggle__description">{{ description }}</span>
    </div>

    <CxSwitch v-model="model" :label small />
  </div>
</template>

<style scoped>
  .codex-settings-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .codex-settings-toggle__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .codex-settings-toggle__label {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
  }

  .codex-settings-toggle__description {
    font-size: 0.75rem;
    line-height: 1.25;
    opacity: 0.7;
  }
</style>
