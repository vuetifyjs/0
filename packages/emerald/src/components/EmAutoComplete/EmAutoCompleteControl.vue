<script lang="ts">
  // Framework
  import { ComboboxActivator } from '@vuetify/v0'

  export interface EmAutoCompleteControlProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAutoCompleteControl' })
</script>

<template>
  <ComboboxActivator class="emerald-auto-complete__control">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ComboboxActivator>
</template>

<style>
.emerald-auto-complete__control {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--emerald-spacing-xs);
  width: 100%;
  padding: 6px 10px;
  border: var(--emerald-stroke-s) solid var(--emerald-border);
  border-radius: var(--emerald-radius-2xs);
  background: var(--emerald-surface);
  transition: border-color 120ms ease, box-shadow 120ms ease;
  cursor: text;
}

.emerald-auto-complete__control[data-state="open"],
.emerald-auto-complete__control:focus-within {
  border-color: var(--emerald-primary-600);
  box-shadow: var(--emerald-shadow-focus);
}
</style>
