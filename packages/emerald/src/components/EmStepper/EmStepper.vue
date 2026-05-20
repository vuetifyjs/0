<script lang="ts">
  // Framework
  import { Atom, StepRoot } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export type EmStepperOrientation = 'horizontal' | 'vertical'

  export interface EmStepperProps extends AtomProps {
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
    orientation?: EmStepperOrientation
  }
</script>

<script setup lang="ts" generic="T">
  defineOptions({ name: 'EmStepper' })

  const {
    disabled = false,
    enroll = false,
    mandatory = false,
    orientation = 'horizontal',
    as = 'div',
    renderless = false,
  } = defineProps<EmStepperProps>()

  const model = defineModel<T>()
</script>

<template>
  <Atom
    :as
    class="emerald-stepper"
    :data-disabled="disabled || undefined"
    :data-orientation="orientation"
    :renderless
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
  </Atom>
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

.emerald-stepper[data-orientation="vertical"] {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.emerald-stepper[data-orientation="vertical"] .emerald-stepper__separator {
  width: 1px;
  height: 24px;
  margin-left: 18px;
}
</style>
