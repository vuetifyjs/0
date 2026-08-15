<script lang="ts">
  // Framework
  import { Step } from '@vuetify/v0'

  export interface EmStepProps {
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
    namespace?: string
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'EmStep' })

  const {
    disabled = false,
    enroll = false,
    mandatory = 'force',
    namespace,
  } = defineProps<EmStepProps>()

  const model = defineModel<T | T[]>()
</script>

<template>
  <!-- Step.Root is renderless — host class / layout on a real element -->
  <div
    class="emerald-step"
    :data-disabled="disabled || undefined"
  >
    <Step.Root
      v-slot="slotProps"
      v-model="model"
      :disabled
      :enroll
      :mandatory
      :namespace
    >
      <slot v-bind="slotProps" />
    </Step.Root>
  </div>
</template>

<style>
  .emerald-step {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--emerald-spacing-m, 16px);
    width: 100%;
    counter-reset: emerald-step;
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 21px);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-step[data-disabled] {
    opacity: 0.5;
  }
</style>
