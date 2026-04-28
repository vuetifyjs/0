<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { Form } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmFormProps extends V0PaperProps {
    disabled?: boolean
    readonly?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmForm' })

  const {
    disabled = false,
    readonly = false,
    ...paperProps
  } = defineProps<EmFormProps>()

  const model = defineModel<boolean | null>({ default: null })

  const emit = defineEmits<{
    submit: [payload: { valid: boolean }]
    reset: []
  }>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-form"
    :data-disabled="disabled || undefined"
    :data-readonly="readonly || undefined"
  >
    <Form
      v-model="model"
      as="form"
      class="emerald-form__root"
      :disabled
      :readonly
      @reset="emit('reset')"
      @submit="(payload) => emit('submit', payload)"
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </Form>
  </V0Paper>
</template>

<style>
.emerald-form {
  display: block;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: #121212;
}

.emerald-form__root {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.emerald-form[data-disabled] {
  opacity: 0.6;
  pointer-events: none;
}

/* Field layout — matches Figma form-field pattern */
.emerald-form .emerald-form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.emerald-form .emerald-form-field__label {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.2;
  color: #121212;
}

.emerald-form .emerald-form-field[data-invalid] .emerald-form-field__label {
  color: var(--emerald-error-700);
}

.emerald-form .emerald-form-field[data-invalid] .emerald-form-field__control:hover {
  border-color: var(--emerald-error-700);
  box-shadow:
    0 1px 3px 0 rgb(var(--emerald-error-500-channels) / 0.18),
    0 1px 5px 0 rgb(var(--emerald-error-500-channels) / 0.22);
}

.emerald-form .emerald-form-field__control {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 32px;
  padding: 6px 8px;
  background: #ffffff;
  border: 1px solid rgb(var(--emerald-neutral-channels) / 0.1);
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.emerald-form .emerald-form-field__control:focus-within {
  border-color: rgb(var(--emerald-neutral-channels) / 0.4);
}

.emerald-form .emerald-form-field[data-invalid] .emerald-form-field__control {
  border-color: rgb(var(--emerald-error-700-channels) / 0.5);
}

.emerald-form .emerald-form-field__control input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  line-height: 20px;
  color: #121212;
  padding: 0;
}

.emerald-form .emerald-form-field__control input::placeholder {
  color: #121212;
  opacity: 0.3;
  font-size: 12px;
}

.emerald-form .emerald-form-field__helper {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.2;
  color: #121212;
  opacity: 0.6;
}

.emerald-form .emerald-form-field__error {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 400;
  font-size: 11px;
  line-height: 1.4;
  color: var(--emerald-error-700);
  opacity: 0.85;
}

.emerald-form .emerald-form-field[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}

</style>
