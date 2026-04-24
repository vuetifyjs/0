<script lang="ts">
  // Framework
  import { StepItem, useStepRoot } from '@vuetify/v0'

  export interface EmStepperItemProps {
    id?: string
    label?: string
    value?: unknown
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmStepperItem' })

  const {
    id,
    label,
    value,
    disabled = false,
  } = defineProps<EmStepperItemProps>()

  const step = useStepRoot('v0:step') as unknown as {
    get: (id: string) => { index: number } | undefined
    selectedIndex: { value: number }
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
      <div
        v-bind="slotProps.attrs"
        class="emerald-stepper__item"
        :data-completed="(step.selectedIndex.value >= 0 && (step.get(slotProps.id)?.index ?? -1) < step.selectedIndex.value) || undefined"
        :data-disabled="slotProps.isDisabled || undefined"
        :data-selected="slotProps.isSelected || undefined"
      >
        <span class="emerald-stepper__item-card">
          <span class="emerald-stepper__item-badge">
            <slot
              v-if="(step.selectedIndex.value >= 0 && (step.get(slotProps.id)?.index ?? -1) < step.selectedIndex.value) && $slots.completed"
              name="completed"
              v-bind="slotProps"
            />
            <slot v-else v-bind="slotProps">
              <span class="emerald-stepper__item-indicator" />
            </slot>
          </span>
        </span>
        <span v-if="$slots.label && slotProps.isSelected" class="emerald-stepper__item-label">
          <slot name="label" v-bind="slotProps" />
        </span>
      </div>
    </template>
  </StepItem>
</template>

<style>
.emerald-stepper__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 0;
  color: inherit;
  font: inherit;
}

.emerald-stepper__item-card {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: #ffffff;
  border: 1px solid var(--emerald-secondary-50);
  border-radius: 6px;
  box-shadow:
    0 8px 20px 0 rgb(var(--emerald-secondary-500-channels) / 0.13),
    0 3px 6px 0 rgb(var(--emerald-secondary-500-channels) / 0.09);
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.emerald-stepper__item-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--emerald-secondary-100);
  border-radius: 4px;
  color: var(--emerald-neutral-600);
  transition: background 120ms ease, color 120ms ease;
}

.emerald-stepper__item-badge svg,
.emerald-stepper__item-badge :deep(svg) {
  width: 16px;
  height: 16px;
}

.emerald-stepper__item-indicator {
  width: 8px;
  height: 8px;
  background: currentColor;
  border-radius: 999px;
  opacity: 0.6;
}

.emerald-stepper__item-label {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  color: var(--emerald-neutral-600);
  font-size: 12px;
  line-height: normal;
  white-space: nowrap;
}

/* Current step — outer ring, stronger border */
.emerald-stepper__item[data-selected] .emerald-stepper__item-card {
  border-color: var(--emerald-secondary-500);
  box-shadow:
    0 0 0 2px rgb(var(--emerald-secondary-500-channels) / 0.25),
    0 8px 20px 0 rgb(var(--emerald-secondary-500-channels) / 0.13),
    0 3px 6px 0 rgb(var(--emerald-secondary-500-channels) / 0.09);
}

/* Completed step — success tint */
.emerald-stepper__item[data-completed] .emerald-stepper__item-card {
  border-color: var(--emerald-success-100);
  box-shadow:
    0 8px 20px 0 rgb(var(--emerald-success-channels) / 0.13),
    0 3px 6px 0 rgb(var(--emerald-success-channels) / 0.09);
}

.emerald-stepper__item[data-completed] .emerald-stepper__item-badge {
  background: var(--emerald-success-100);
  color: var(--emerald-success-700);
}

.emerald-stepper__item[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.emerald-stepper__item:focus-visible {
  outline: 2px solid var(--emerald-secondary-500);
  outline-offset: 2px;
  border-radius: 6px;
}
</style>
