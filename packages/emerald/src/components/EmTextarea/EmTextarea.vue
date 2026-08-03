<script lang="ts">
  // Framework
  import { Input } from '@vuetify/v0'
  // Utilities
  import { useId } from '@vuetify/v0/utilities'

  // Types
  import type { FormValidationRule, ID, ValidateOn } from '@vuetify/v0'

  export interface EmTextareaProps {
    id?: ID
    /** Visible label text; associated via `for`/`id` (not Root aria-label) */
    label?: string
    /** Help text under the control (no named slots — props only) */
    description?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    name?: string
    placeholder?: string
    rules?: FormValidationRule[]
    validateOn?: ValidateOn
    error?: boolean
    errorMessages?: string | string[]
    namespace?: string
    /** Visible text rows; drives native `rows` and control min-height */
    rows?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextarea' })

  const {
    id: _id,
    label,
    description,
    disabled = false,
    readonly = false,
    required = false,
    name,
    placeholder,
    rules,
    validateOn,
    error = false,
    errorMessages,
    namespace,
    rows = 3,
  } = defineProps<EmTextareaProps>()

  const model = defineModel<string>({ default: '' })
  const fallbackId = useId()
  const id = _id ?? fallbackId
</script>

<template>
  <Input.Root
    :id
    v-model="model"
    class="emerald-textarea"
    :data-disabled="disabled || undefined"
    :disabled
    :error
    :error-messages
    :name
    :namespace
    :readonly
    :required
    :rules
    :validate-on
  >
    <label
      v-if="label"
      class="emerald-textarea__label"
      :for="String(id)"
    >
      {{ label }}
    </label>

    <Input.Control
      as="textarea"
      class="emerald-textarea__control"
      :namespace
      :placeholder
      :rows
      :style="{ '--emerald-textarea-rows': rows }"
    />

    <Input.Description
      v-if="description"
      class="emerald-textarea__description"
      :namespace
    >
      {{ description }}
    </Input.Description>

    <Input.Error v-slot="{ errors }" class="emerald-textarea__error" :namespace>
      <span v-for="message in errors" :key="message">{{ message }}</span>
    </Input.Error>
  </Input.Root>
</template>

<style>
  .emerald-textarea {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--emerald-spacing-2xs, 4px);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    width: 100%;
  }

  .emerald-textarea__label {
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 21px);
    font-weight: var(--emerald-text-b2-bold-weight, 600);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-textarea[data-disabled] .emerald-textarea__label {
    color: var(--emerald-neutral-400, #aeb6be);
  }

  .emerald-textarea__control {
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
    resize: vertical;
    min-height: calc(
      var(--emerald-textarea-rows, 3) * var(--emerald-text-b1-height, 24px)
      + 2 * var(--emerald-spacing-xs, 8px)
    );
    transition:
      border-color var(--emerald-motion-duration-fast, 120ms) ease,
      box-shadow var(--emerald-motion-duration-fast, 120ms) ease;
  }

  .emerald-textarea__control::placeholder {
    color: var(--emerald-neutral-500, #a3afbe);
    opacity: 1;
  }

  .emerald-textarea__control:hover:not([data-disabled]):not([data-readonly]):not([data-focused]) {
    border-color: var(--emerald-neutral-600, #939dac);
  }

  .emerald-textarea__control:focus-visible,
  .emerald-textarea__control[data-focused] {
    border-color: var(--emerald-primary-600, #1fae60);
    box-shadow: var(--emerald-shadow-focus, 0 0 0 5px rgba(38, 194, 109, 0.2));
  }

  .emerald-textarea__control[data-disabled] {
    background: var(--emerald-neutral-200, #f6f8fa);
    border-color: var(--emerald-neutral-300, #ccd6e7);
    color: var(--emerald-neutral-400, #aeb6be);
    cursor: not-allowed;
    resize: none;
  }

  .emerald-textarea__control[data-readonly]:not([data-disabled]) {
    background: var(--emerald-neutral-100, #fefefe);
    color: var(--emerald-neutral-800, #636a70);
    cursor: default;
  }

  .emerald-textarea__control[data-state='invalid']:not([data-disabled]),
  .emerald-textarea__control[data-state='invalid']:focus-visible,
  .emerald-textarea__control[data-state='invalid'][data-focused] {
    border-color: var(--emerald-danger-500, #c61424);
    box-shadow: var(--emerald-shadow-danger, 0 0 0 5px rgba(251, 55, 72, 0.2));
  }

  .emerald-textarea__description {
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: var(--emerald-text-b3-height, 18px);
    color: var(--emerald-neutral-700, #757e85);
  }

  .emerald-textarea__error {
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: var(--emerald-text-b3-height, 18px);
    color: var(--emerald-danger-600, #a1000e);
  }

  .emerald-textarea__error[data-state='hidden'] {
    display: none;
  }
</style>
