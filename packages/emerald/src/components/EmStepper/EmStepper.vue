<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { StepRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmStepperProps extends V0PaperProps {
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
  }
</script>

<script setup lang="ts" generic="T">
  defineOptions({ name: 'EmStepper' })

  const {
    disabled = false,
    enroll = false,
    mandatory = false,
    ...paperProps
  } = defineProps<EmStepperProps>()

  const model = defineModel<T>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-stepper"
    :data-disabled="disabled || undefined"
  >
    <StepRoot
      v-model="model"
      :disabled
      :enroll
      :mandatory
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </StepRoot>
  </V0Paper>
</template>

<style>
.emerald-stepper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: var(--emerald-on-background, #2d3139);
}

.emerald-stepper[data-disabled] {
  opacity: 0.6;
  pointer-events: none;
}
</style>
