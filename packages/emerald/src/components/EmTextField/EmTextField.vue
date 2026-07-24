<script lang="ts">
  // Framework
  import { Input } from '@vuetify/v0'

  // Types
  import type { FormValidationRule, ValidateOn } from '@vuetify/v0'

  export interface EmTextFieldProps {
    disabled?: boolean
    readonly?: boolean
    name?: string
    type?: string
    placeholder?: string
    /** Native autocomplete attribute */
    autocomplete?: string
    rules?: FormValidationRule[]
    validateOn?: ValidateOn
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextField' })

  const {
    disabled = false,
    readonly = false,
    name,
    type = 'text',
    placeholder,
    autocomplete,
    rules,
    validateOn,
  } = defineProps<EmTextFieldProps>()

  const model = defineModel<string>({ default: '' })
</script>

<template>
  <Input.Root
    v-model="model"
    class="emerald-text-field"
    :disabled
    :name
    :readonly
    :rules
    :validate-on
  >
    <label v-if="$slots.label" class="emerald-text-field__label">
      <slot name="label" />
    </label>

    <Input.Control
      :autocomplete
      class="emerald-text-field__control"
      :placeholder
      :type
    />

    <Input.Description v-if="$slots.description" class="emerald-text-field__description">
      <slot name="description" />
    </Input.Description>

    <Input.Error class="emerald-text-field__error" />
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
    transition: border-color 120ms ease, box-shadow 120ms ease;
  }

  .emerald-text-field__control::placeholder {
    color: var(--emerald-neutral-500, #a3afbe);
    opacity: 1;
  }

  .emerald-text-field__control:hover:not([data-disabled]):not([data-focused]) {
    border-color: var(--emerald-neutral-600, #939dac);
  }

  .emerald-text-field__control:focus,
  .emerald-text-field__control[data-focused] {
    box-shadow: var(--emerald-shadow-focus, 0 0 0 5px rgba(38, 194, 109, 0.2));
  }

  .emerald-text-field__control[data-disabled] {
    background: var(--emerald-neutral-200, #ebf0f4);
    border-color: var(--emerald-neutral-300, #ccd6e7);
    color: var(--emerald-neutral-400, #aeb6be);
    cursor: not-allowed;
  }

  .emerald-text-field__control[data-state='invalid']:not([data-disabled]),
  .emerald-text-field__control[data-state='invalid']:focus,
  .emerald-text-field__control[data-state='invalid'][data-focused] {
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
</style>
