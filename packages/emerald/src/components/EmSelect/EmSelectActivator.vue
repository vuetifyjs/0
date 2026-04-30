<script lang="ts">
  // Framework
  import { SelectActivator } from '@vuetify/v0'

  export interface EmSelectActivatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelectActivator' })
</script>

<template>
  <SelectActivator class="emerald-select__activator">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </SelectActivator>
</template>

<style>
.emerald-select__activator {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 4px;
  background: #ffffff;
  font-family: inherit;
  font-size: 12px;
  line-height: 20px;
  color: #000000;
  cursor: pointer;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.emerald-select__activator:hover:not([data-select-open]) {
  border-color: rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.3);
  box-shadow:
    0 1px 3px 0 rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.12),
    0 1px 5px 0 rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.2);
}

.emerald-select__activator:focus-visible,
.emerald-select__activator[data-select-open] {
  outline: none;
  border-color: var(--emerald-primary-500);
  box-shadow: 0 0 0 2px rgb(var(--emerald-primary-500-channels) / 0.12);
}

.emerald-select__activator[data-select-open] > svg:last-child {
  transform: rotate(180deg);
  transition: transform 180ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.emerald-select__activator > svg:last-child {
  transition: transform 180ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
</style>
