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
  padding: 6px 8px;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 4px;
  background: #ffffff;
  color: var(--emerald-on-background, #1a1c1e);
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  resize: vertical;
  transition: border-color 120ms ease, box-shadow 120ms ease, background-color 120ms ease;
}

.emerald-textarea__control::placeholder {
  color: rgb(0 0 0 / 0.3);
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: 20px;
}

.emerald-textarea__control:hover:not(:focus):not([disabled]):not([readonly]) {
  border-color: rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.3);
  box-shadow:
    0 1px 3px 0 rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.12),
    0 1px 5px 0 rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.2);
}

.emerald-textarea__control:focus {
  outline: none;
  border-color: var(--emerald-primary-500, #7c5cf6);
  box-shadow: 0 0 0 2px rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.12);
}

.emerald-textarea__control[data-state="invalid"] {
  border-color: var(--emerald-error-500, #e5484d);
}

.emerald-textarea__control[data-state="invalid"]:hover:not(:focus):not([disabled]):not([readonly]) {
  border-color: var(--emerald-error-700, #b8302a);
  box-shadow:
    0 1px 3px 0 rgb(var(--emerald-error-500-channels, 229 72 77) / 0.18),
    0 1px 5px 0 rgb(var(--emerald-error-500-channels, 229 72 77) / 0.22);
}

.emerald-textarea__control[data-state="invalid"]:focus {
  box-shadow: 0 0 0 2px rgb(var(--emerald-error-500-channels, 229 72 77) / 0.18);
}

.emerald-textarea__control[disabled],
.emerald-textarea__control[data-disabled] {
  background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.05);
  border-color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.08);
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.4);
  cursor: not-allowed;
  box-shadow: none;
}

.emerald-textarea__control[disabled]::placeholder,
.emerald-textarea__control[data-disabled]::placeholder {
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.4);
  opacity: 1;
}

.emerald-textarea__control[readonly],
.emerald-textarea__control[data-readonly] {
  background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.04);
  cursor: default;
}
</style>
