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
  min-height: 36px;
  padding: 8px 12px;
  border-left: 1px solid transparent;
  border-radius: 0 6px 6px 0;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: var(--emerald-primary-950);
  cursor: pointer;
  user-select: none;
  transition: background-color 120ms ease, color 120ms ease;
}

.emerald-auto-complete__item[data-focused],
.emerald-auto-complete__item:hover {
  background: var(--emerald-primary-100);
  border-left-color: var(--emerald-primary-500);
  color: var(--emerald-primary-500);
  font-weight: 500;
}

.emerald-auto-complete__item[data-selected] {
  background: var(--emerald-primary-100);
  border-left-color: var(--emerald-primary-500);
  color: var(--emerald-primary-500);
  font-weight: 500;
}

.emerald-auto-complete__item[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}
</style>
