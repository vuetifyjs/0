<script lang="ts">
  export type EmDatePickerActionVariant = 'primary' | 'secondary'

  export interface EmDatePickerActionProps {
    variant?: EmDatePickerActionVariant
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerAction' })

  const {
    variant = 'primary',
    disabled = false,
    type = 'button',
  } = defineProps<EmDatePickerActionProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    if (disabled) return

    emit('click', event)
  }
</script>

<template>
  <button
    class="emerald-date-picker__action"
    :data-disabled="disabled || undefined"
    :data-variant="variant"
    :disabled="disabled || undefined"
    :type
    @click="onClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.emerald-date-picker__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  gap: var(--emerald-spacing-xs);
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s);
  border: var(--emerald-stroke-s) solid transparent;
  border-radius: var(--emerald-radius-m);
  font-family: inherit;
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-bold-weight);
  line-height: var(--emerald-text-b1-height);
  cursor: pointer;
}

.emerald-date-picker__action[data-variant="primary"] {
  background: var(--emerald-primary-600);
  color: var(--emerald-on-primary);
}

.emerald-date-picker__action[data-variant="secondary"] {
  background: transparent;
  border-color: var(--emerald-secondary-600);
  color: var(--emerald-secondary-600);
}

.emerald-date-picker__action:focus-visible {
  outline: none;
  box-shadow: var(--emerald-shadow-focus);
}

.emerald-date-picker__action[data-disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
