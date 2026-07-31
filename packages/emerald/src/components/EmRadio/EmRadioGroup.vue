<script lang="ts">
  // Framework
  import { Radio } from '@vuetify/v0'

  export interface EmRadioGroupProps {
    disabled?: boolean
    name?: string
    namespace?: string
    mandatory?: boolean | 'force'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmRadioGroup' })

  const {
    disabled = false,
    name,
    namespace,
    mandatory = false,
  } = defineProps<EmRadioGroupProps>()

  const model = defineModel<unknown>()
</script>

<template>
  <Radio.Group
    v-model="model"
    class="emerald-radio-group"
    :data-disabled="disabled || undefined"
    :disabled
    :mandatory
    :name
    :namespace
  >
    <slot />
  </Radio.Group>
</template>

<style>
  .emerald-radio-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    color: var(--emerald-on-background, #2b2d2e);
  }

  .emerald-radio-group[data-disabled] {
    cursor: not-allowed;
  }
</style>
