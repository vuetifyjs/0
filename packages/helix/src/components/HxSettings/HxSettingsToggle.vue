<script lang="ts">
  // Components
  import { HxSwitch } from '#helix/components/HxSwitch'

  export interface HxSettingsToggleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxSettingsToggle' })

  defineProps<HxSettingsToggleProps>()

  const model = defineModel<boolean>({ required: true })
</script>

<template>
  <div class="helix-settings-toggle">
    <slot />

    <HxSwitch v-model="model" small />
  </div>
</template>

<style scoped>
  .helix-settings-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
</style>
