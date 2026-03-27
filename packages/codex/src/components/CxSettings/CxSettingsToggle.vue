<script lang="ts">
  // Components
  import { CxSwitch } from '#codex/components/CxSwitch'

  export interface CxSettingsToggleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxSettingsToggle' })

  defineProps<CxSettingsToggleProps>()

  const model = defineModel<boolean>({ required: true })
</script>

<template>
  <div class="codex-settings-toggle">
    <slot />

    <CxSwitch v-model="model" small />
  </div>
</template>

<style scoped>
  .codex-settings-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
</style>
