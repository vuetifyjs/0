<script lang="ts">
  // Framework
  import { useId } from '@vuetify/v0'

  export interface EmDatePickerInputProps {
    label?: string
    required?: boolean
    placeholder?: string
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerInput' })

  const {
    label,
    required = false,
    placeholder,
    disabled = false,
  } = defineProps<EmDatePickerInputProps>()

  const model = defineModel<string>({ default: '' })

  const id = useId()
</script>

<template>
  <div class="emerald-date-picker__input" :data-disabled="disabled || undefined">
    <label v-if="label" class="emerald-date-picker__input-label" :for="id">
      {{ label }}

      <span v-if="required" aria-hidden="true" class="emerald-date-picker__input-required">*</span>
    </label>

    <div class="emerald-date-picker__input-field">
      <slot>
        <svg
          aria-hidden="true"
          class="emerald-date-picker__input-icon"
          fill="none"
          height="24"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          viewBox="0 0 24 24"
          width="24"
        >
          <rect
            height="16"
            rx="2"
            width="18"
            x="3"
            y="5"
          />

          <path d="M16 3v4M8 3v4M3 11h18" />
        </svg>
      </slot>

      <input
        :id
        v-model="model"
        :disabled
        :placeholder
        :required
        type="text"
      >
    </div>
  </div>
</template>

<style scoped>
.emerald-date-picker__input {
  display: flex;
  flex-direction: column;
  gap: var(--emerald-spacing-2xs);
  width: 100%;
  font-family: var(--emerald-font-sans);
}

.emerald-date-picker__input-label {
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-bold-weight);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
}

.emerald-date-picker__input-required {
  color: var(--emerald-danger-600);
}

.emerald-date-picker__input-field {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  gap: var(--emerald-spacing-xs);
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-m);
  border: var(--emerald-stroke-s) solid var(--emerald-border);
  border-radius: var(--emerald-radius-m);
  background: var(--emerald-surface);
  color: var(--emerald-on-surface);
}

.emerald-date-picker__input-field:focus-within {
  border-color: var(--emerald-primary-600);
  box-shadow: var(--emerald-shadow-focus);
}

.emerald-date-picker__input-icon {
  flex-shrink: 0;
}

.emerald-date-picker__input-field input {
  flex: 1 1 auto;
  min-width: 0;
  padding: 0;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-weight);
  line-height: var(--emerald-text-b1-height);
  color: inherit;
  outline: none;
}

.emerald-date-picker__input-field input::placeholder {
  color: var(--emerald-neutral-500);
}

.emerald-date-picker__input[data-disabled] {
  opacity: 0.6;
  pointer-events: none;
}
</style>
