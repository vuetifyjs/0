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
  gap: var(--emerald-spacing-xs);
  width: 100%;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-m);
  border: var(--emerald-stroke-s) solid var(--emerald-border);
  border-radius: var(--emerald-radius-m);
  background: var(--emerald-neutral-100);
  font-family: inherit;
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-weight);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
  cursor: pointer;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}

.emerald-select__activator:focus-visible,
.emerald-select__activator[data-select-open] {
  outline: none;
  border-color: var(--emerald-primary-600);
  box-shadow: var(--emerald-shadow-focus-s);
}

.emerald-select__activator[data-select-open] > svg:last-child,
.emerald-select__activator[data-select-open] .emerald-select__icon {
  transform: rotate(180deg);
}

.emerald-select__activator > svg:last-child {
  transition: transform 180ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
</style>
