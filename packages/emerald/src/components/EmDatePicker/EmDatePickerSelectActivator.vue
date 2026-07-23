<script lang="ts">
  // Framework
  import { SelectActivator } from '@vuetify/v0'

  export interface EmDatePickerSelectActivatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDatePickerSelectActivator' })
</script>

<template>
  <SelectActivator class="emerald-date-picker__select-activator">
    <template #default="slotProps">
      <slot v-bind="slotProps" />

      <svg
        aria-hidden="true"
        class="emerald-date-picker__select-caret"
        fill="none"
        height="18"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="18"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </template>
  </SelectActivator>
</template>

<style scoped>
.emerald-date-picker__select-activator {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-2xs);
  padding: 0 var(--emerald-spacing-xs);
  border: none;
  border-radius: var(--emerald-radius-xs);
  background: transparent;
  font-family: inherit;
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-bold-weight);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
  cursor: pointer;
}

.emerald-date-picker__select-activator:hover:not([data-select-open]) {
  background: var(--emerald-neutral-200);
}

.emerald-date-picker__select-activator[data-select-open] {
  color: var(--emerald-success-600);
}

.emerald-date-picker__select-activator[data-disabled] {
  color: var(--emerald-neutral-400);
  cursor: not-allowed;
  pointer-events: none;
}

.emerald-date-picker__select-activator:focus-visible {
  outline: none;
  box-shadow: var(--emerald-shadow-focus);
}

.emerald-date-picker__select-caret {
  flex-shrink: 0;
  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1);
}

.emerald-date-picker__select-activator[data-select-open] .emerald-date-picker__select-caret {
  transform: rotate(180deg);
}
</style>
