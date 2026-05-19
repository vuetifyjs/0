<script lang="ts">
  // Framework
  import { InputControl } from '@vuetify/v0'

  export interface EmTextFieldControlProps {
    placeholder?: string
    autocomplete?: string
    maxlength?: number
    min?: number | string
    max?: number | string
    step?: number | string
    inputmode?: string
    pattern?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldControl' })

  const {
    placeholder,
    autocomplete,
    maxlength,
    min,
    max,
    step,
    inputmode,
    pattern,
  } = defineProps<EmTextFieldControlProps>()
</script>

<template>
  <InputControl
    :autocomplete
    class="emerald-text-field__control"
    :inputmode
    :max
    :maxlength
    :min
    :pattern
    :placeholder
    :step
  >
    <slot />
  </InputControl>
</template>

<style>
.emerald-text-field__control {
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  margin: 0;
  padding: 6px 8px;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 4px;
  background: #ffffff;
  font-family: inherit;
  font-size: 12px;
  line-height: 20px;
  color: #000000;
  outline: none;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.emerald-text-field__control::placeholder {
  color: #000000;
  opacity: 0.3;
}

.emerald-text-field__control:hover:not([data-disabled]):not([data-focused]) {
  border-color: rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.3);
  box-shadow:
    0 1px 3px 0 rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.12),
    0 1px 5px 0 rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.2);
}

.emerald-text-field__control:focus,
.emerald-text-field__control[data-focused] {
  border-color: var(--emerald-primary-500, #7c5cf6);
  box-shadow: 0 0 0 2px rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.12);
}

.emerald-text-field__control[data-disabled],
.emerald-text-field[data-disabled] .emerald-text-field__control {
  background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.05);
  border-color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.08);
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.4);
  cursor: not-allowed;
}

.emerald-text-field__control[data-disabled]::placeholder,
.emerald-text-field[data-disabled] .emerald-text-field__control::placeholder {
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.4);
  opacity: 1;
}

.emerald-text-field__control[data-state="invalid"] {
  border-color: var(--emerald-error-500, #e5484d);
}

.emerald-text-field__control[data-state="invalid"]:hover:not([data-disabled]):not([data-focused]) {
  border-color: var(--emerald-error-700, #b8302a);
  box-shadow:
    0 1px 3px 0 rgb(var(--emerald-error-500-channels, 229 72 77) / 0.18),
    0 1px 5px 0 rgb(var(--emerald-error-500-channels, 229 72 77) / 0.22);
}

.emerald-text-field__control[data-state="invalid"]:focus,
.emerald-text-field__control[data-state="invalid"][data-focused] {
  box-shadow: 0 0 0 2px rgb(var(--emerald-error-500-channels, 229 72 77) / 0.18);
}
</style>
