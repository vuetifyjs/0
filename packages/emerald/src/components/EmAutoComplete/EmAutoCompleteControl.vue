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
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 4px;
  background: #ffffff;
  transition: border-color 120ms ease, box-shadow 120ms ease;
  cursor: text;
}

.emerald-auto-complete__control[data-state="open"],
.emerald-auto-complete__control:focus-within {
  border-color: var(--emerald-primary-500);
  box-shadow: 0 0 0 2px rgb(var(--emerald-primary-500-channels) / 0.12);
}
</style>
