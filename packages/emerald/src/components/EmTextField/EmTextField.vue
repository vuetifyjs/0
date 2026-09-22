<script lang="ts">
  // Framework
  import { Input } from '@vuetify/v0'
  import { useId } from '@vuetify/v0/utilities'

  // Utilities
  import { toValue } from 'vue'

  // Types
  import type { InputRootProps } from '@vuetify/v0'

  /** Emerald withholds `form` from v0's input surface; everything else tracks it. */
  type EmTextFieldKeys = 'id' | 'label' | 'disabled' | 'readonly' | 'required' | 'name' | 'type' | 'rules' | 'validateOn' | 'error' | 'errorMessages' | 'namespace'

  export interface EmTextFieldProps extends Pick<InputRootProps, EmTextFieldKeys> {
    /** Visible label text; associated via `for`/`id` (not Root aria-label) */
    label?: InputRootProps['label']
    /** Native input type — owned by Input.Root, not Control */
    type?: InputRootProps['type']
    /** Help text under the control (no named slots — props only) */
    description?: string
    placeholder?: string
    autocomplete?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextField' })

  const {
    id: _id,
    label,
    description,
    disabled = false,
    readonly = false,
    required = false,
    name,
    type = 'text',
    placeholder,
    autocomplete,
    rules,
    validateOn,
    error = false,
    errorMessages,
    namespace,
  } = defineProps<EmTextFieldProps>()

  const model = defineModel<string>({ default: '' })
  const fallbackId = useId()
  const id = _id ?? fallbackId
</script>

<template>
  <Input.Root
    :id
    v-model="model"
    class="emerald-text-field"
    :data-disabled="toValue(disabled) || undefined"
    :disabled
    :error
    :error-messages
    :name
    :namespace
    :readonly
    :required
    :rules
    :type
    :validate-on
  >
    <label
      v-if="label"
      class="emerald-text-field__label"
      :for="String(id)"
    >
      {{ label }}
    </label>

    <Input.Control
      :autocomplete
      class="emerald-text-field__control"
      :namespace
      :placeholder
    />

    <Input.Description
      v-if="description"
      class="emerald-text-field__description"
      :namespace
    >
      {{ description }}
    </Input.Description>

    <Input.Error v-slot="{ errors }" class="emerald-text-field__error" :namespace>
      <span v-for="message in errors" :key="message">{{ message }}</span>
    </Input.Error>
  </Input.Root>
</template>

<style>
  .emerald-text-field {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--emerald-spacing-2xs, 4px);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    width: 100%;
  }

  .emerald-text-field__label {
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 21px);
    font-weight: var(--emerald-text-b2-bold-weight, 600);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-text-field[data-disabled] .emerald-text-field__label {
    color: var(--emerald-neutral-400, #aeb6be);
  }

  .emerald-text-field__control {
    display: block;
    box-sizing: border-box;
    width: 100%;
    margin: 0;
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-m, 16px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-border, #aeb6be);
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-background, #fefefe);
    font-family: inherit;
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: var(--emerald-text-b1-weight, 400);
    line-height: var(--emerald-text-b1-height, 24px);
    color: var(--emerald-neutral-1000, #2b2d2e);
    outline: none;
    transition:
      border-color var(--emerald-motion-duration-fast, 120ms) ease,
      box-shadow var(--emerald-motion-duration-fast, 120ms) ease;
  }

  .emerald-text-field__control::placeholder {
    color: var(--emerald-neutral-500, #a3afbe);
    opacity: 1;
  }

  .emerald-text-field__control:hover:not([data-disabled]):not([data-readonly]):not([data-focused]) {
    border-color: var(--emerald-neutral-600, #939dac);
  }

  .emerald-text-field__control:focus-visible,
  .emerald-text-field__control[data-focused] {
    border-color: var(--emerald-primary-600, #1fae60);
    box-shadow: var(--emerald-shadow-focus, 0 0 0 5px rgba(38, 194, 109, 0.2));
  }

  .emerald-text-field__control[data-disabled] {
    background: var(--emerald-neutral-200, #f6f8fa);
    border-color: var(--emerald-neutral-300, #ccd6e7);
    color: var(--emerald-neutral-400, #aeb6be);
    cursor: not-allowed;
  }

  .emerald-text-field__control[data-readonly]:not([data-disabled]) {
    background: var(--emerald-neutral-100, #fefefe);
    color: var(--emerald-neutral-800, #636a70);
    cursor: default;
  }

  .emerald-text-field__control[data-state='invalid']:not([data-disabled]),
  .emerald-text-field__control[data-state='invalid']:focus-visible,
  .emerald-text-field__control[data-state='invalid'][data-focused] {
    border-color: var(--emerald-danger-500, #c61424);
    box-shadow: var(--emerald-shadow-danger, 0 0 0 5px rgba(251, 55, 72, 0.2));
  }

  .emerald-text-field__description {
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: var(--emerald-text-b3-height, 18px);
    color: var(--emerald-neutral-700, #757e85);
  }

  .emerald-text-field__error {
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: var(--emerald-text-b3-height, 18px);
    color: var(--emerald-danger-600, #a1000e);
  }

  .emerald-text-field__error[data-state='hidden'] {
    display: none;
  }
</style>
