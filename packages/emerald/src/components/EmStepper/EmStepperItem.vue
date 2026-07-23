<script lang="ts">
  // Framework
  import { StepItem, useStepRoot } from '@vuetify/v0'

  // Types
  import type { StepItemSlotProps } from '@vuetify/v0'

  export interface EmStepperItemProps {
    id?: string
    label?: string
    value?: unknown
    disabled?: boolean
  }

  export interface EmStepperItemSlotProps extends StepItemSlotProps {
    isCompleted: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmStepperItem' })

  defineSlots<{
    default: (props: EmStepperItemSlotProps) => unknown
  }>()

  const {
    id,
    label,
    value,
    disabled = false,
  } = defineProps<EmStepperItemProps>()

  const step = useStepRoot('v0:step')

  function completed (ticket: string) {
    const index = step.get(ticket)?.index ?? -1

    return step.selectedIndex.value >= 0 && index < step.selectedIndex.value
  }
</script>

<template>
  <StepItem
    :id
    :disabled
    :label
    :value
  >
    <template #default="slotProps">
      <button
        v-bind="slotProps.attrs"
        :aria-current="slotProps.isSelected ? 'step' : undefined"
        :aria-selected="undefined"
        class="emerald-stepper__item"
        :data-completed="completed(slotProps.id) || undefined"
        :data-disabled="slotProps.isDisabled || undefined"
        :data-selected="slotProps.isSelected || undefined"
        :tabindex="slotProps.isDisabled ? -1 : undefined"
        type="button"
      >
        <slot v-bind="{ ...slotProps, isCompleted: completed(slotProps.id) }" />
      </button>
    </template>
  </StepItem>
</template>

<style>
.emerald-stepper__item {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-xs);
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 0;
  color: inherit;
  font: inherit;
}

.emerald-stepper__item[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.emerald-stepper__item:focus-visible {
  outline: var(--emerald-stroke-m) solid var(--emerald-primary-600);
  outline-offset: var(--emerald-spacing-3xs);
  border-radius: var(--emerald-radius-s);
}
</style>
