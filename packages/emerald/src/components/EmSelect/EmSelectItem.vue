<script lang="ts">
  // Framework
  import { SelectItem } from '@vuetify/v0'

  export interface EmSelectItemProps {
    value?: unknown
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelectItem' })

  const { value, disabled = false } = defineProps<EmSelectItemProps>()
</script>

<template>
  <SelectItem
    class="emerald-select__item"
    :disabled
    :value
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </SelectItem>
</template>

<style>
.emerald-select__item {
  display: flex;
  align-items: center;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s);
  border-left: var(--emerald-stroke-s) solid var(--emerald-neutral-300);
  border-radius: 0 var(--emerald-radius-xs) var(--emerald-radius-xs) 0;
  background: var(--emerald-neutral-100);
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b1-size);
  font-weight: var(--emerald-text-b1-weight);
  line-height: var(--emerald-text-b1-height);
  color: var(--emerald-on-surface);
  cursor: pointer;
  user-select: none;
  transition: background-color 120ms ease, border-color 120ms ease;
}

.emerald-select__item[data-focused],
.emerald-select__item:hover {
  background: var(--emerald-neutral-200);
  border-left-color: var(--emerald-neutral-600);
}

.emerald-select__item[data-selected] {
  background: var(--emerald-primary-100);
  border-left-color: var(--emerald-primary-600);
}

.emerald-select__item[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}
</style>
