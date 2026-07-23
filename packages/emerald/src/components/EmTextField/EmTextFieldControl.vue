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
  margin: 0;
  padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-m, 16px);
  border: var(--emerald-stroke-s, 1px) solid var(--emerald-border, #AEB6BE);
  border-radius: var(--emerald-radius-m, 8px);
  background: var(--emerald-background, #FEFEFE);
  font-family: inherit;
  font-size: var(--emerald-text-b1-size, 16px);
  font-weight: var(--emerald-text-b1-weight, 400);
  line-height: var(--emerald-text-b1-height, 24px);
  color: var(--emerald-neutral-1000, #2B2D2E);
  outline: none;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.emerald-text-field__control::placeholder {
  color: var(--emerald-neutral-500, #A3AFBE);
  opacity: 1;
}

.emerald-text-field__control:hover:not([data-disabled]):not([data-focused]) {
  border-color: var(--emerald-neutral-600, #939DAC);
}

.emerald-text-field__control:focus,
.emerald-text-field__control[data-focused] {
  box-shadow: var(--emerald-shadow-focus, 0px 0px 0px 5px rgba(38, 194, 109, 0.2));
}

.emerald-text-field__control[data-disabled] {
  background: var(--emerald-neutral-200, #EBF0F4);
  border-color: var(--emerald-neutral-300, #CCD6E7);
  color: var(--emerald-neutral-400, #AEB6BE);
  cursor: not-allowed;
}

.emerald-text-field__control[data-state="invalid"]:not([data-disabled]),
.emerald-text-field__control[data-state="invalid"]:focus,
.emerald-text-field__control[data-state="invalid"][data-focused] {
  box-shadow: var(--emerald-shadow-danger, 0px 0px 0px 5px rgba(251, 55, 72, 0.2));
}
</style>
