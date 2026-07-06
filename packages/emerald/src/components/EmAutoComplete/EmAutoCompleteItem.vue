<script lang="ts">
  // Framework
  import { ComboboxItem } from '@vuetify/v0'

  // Types
  import type { MaybeRefOrGetter } from 'vue'

  export interface EmAutoCompleteItemProps {
    value?: unknown
    disabled?: MaybeRefOrGetter<boolean>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAutoCompleteItem' })

  const { value, disabled = false } = defineProps<EmAutoCompleteItemProps>()
</script>

<template>
  <ComboboxItem
    class="emerald-auto-complete__item"
    :disabled
    :value
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </ComboboxItem>
</template>

<style>
.emerald-auto-complete__item {
  display: flex;
  align-items: center;
  gap: var(--emerald-spacing-xs);
  min-height: 36px;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s);
  background: var(--emerald-background);
  border-inline-start: var(--emerald-stroke-s) solid var(--emerald-divider);
  border-start-end-radius: var(--emerald-radius-xs);
  border-end-end-radius: var(--emerald-radius-xs);
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-weight);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
  cursor: pointer;
  user-select: none;
  transition: background-color 120ms ease, border-color 120ms ease;
}

.emerald-auto-complete__item[data-focused]:not([data-selected]),
.emerald-auto-complete__item:hover:not([data-selected]) {
  background: var(--emerald-neutral-200);
  border-inline-start-color: var(--emerald-neutral-600);
}

.emerald-auto-complete__item[data-selected] {
  background: var(--emerald-primary-100);
  border-inline-start-color: var(--emerald-primary-600);
}

.emerald-auto-complete__item[data-disabled] {
  color: var(--emerald-neutral-400);
  pointer-events: none;
}
</style>
