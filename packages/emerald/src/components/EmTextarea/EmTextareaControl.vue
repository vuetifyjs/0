<script lang="ts">
  // Framework
  import { InputControl } from '@vuetify/v0'

  export interface EmTextareaControlProps {
    placeholder?: string
    maxlength?: number
    rows?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextareaControl' })

  const { placeholder, maxlength, rows = 4 } = defineProps<EmTextareaControlProps>()
</script>

<template>
  <InputControl
    as="textarea"
    class="emerald-textarea__control"
    :maxlength
    :placeholder
    :rows
  >
    <slot />
  </InputControl>
</template>

<style>
.emerald-textarea__control {
  display: block;
  width: 100%;
  padding: var(--emerald-spacing-xs, 8px);
  border: var(--emerald-stroke-s, 1px) solid var(--emerald-border, #aeb6be);
  border-radius: var(--emerald-radius-m, 8px);
  background: var(--emerald-background, #fefefe);
  color: var(--emerald-on-background, #2b2d2e);
  font-family: var(--emerald-font-sans, Manrope, system-ui, -apple-system, sans-serif);
  font-size: var(--emerald-text-b1-size, 16px);
  font-weight: var(--emerald-text-b1-weight, 400);
  line-height: var(--emerald-text-b1-height, 24px);
  resize: vertical;
  transition: border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
}

.emerald-textarea__control::placeholder {
  color: var(--emerald-neutral-400, #aeb6be);
}

.emerald-textarea__control:hover:not(:focus):not([disabled]):not([readonly]):not([data-state="invalid"]) {
  border-color: var(--emerald-neutral-600, #939dac);
}

.emerald-textarea__control:focus {
  outline: none;
  box-shadow: var(--emerald-shadow-focus, 0 0 0 5px rgba(38, 194, 109, 0.2));
}

.emerald-textarea__control[data-state="invalid"] {
  box-shadow: var(--emerald-shadow-danger, 0 0 0 5px rgba(251, 55, 72, 0.2));
}

.emerald-textarea__control[disabled],
.emerald-textarea__control[data-disabled] {
  background: var(--emerald-neutral-200, #ebf0f4);
  border-color: var(--emerald-neutral-300, #ccd6e7);
  color: var(--emerald-neutral-400, #aeb6be);
  cursor: not-allowed;
  box-shadow: none;
}

.emerald-textarea__control[disabled]::placeholder,
.emerald-textarea__control[data-disabled]::placeholder {
  color: var(--emerald-neutral-400, #aeb6be);
  opacity: 1;
}

.emerald-textarea__control[readonly],
.emerald-textarea__control[data-readonly] {
  background: rgb(var(--emerald-neutral-channels, 51 51 51) / 0.04);
  cursor: default;
}
</style>
