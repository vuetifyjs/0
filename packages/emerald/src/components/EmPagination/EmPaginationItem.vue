<script lang="ts">
  // Framework
  import { PaginationItem } from '@vuetify/v0'

  export interface EmPaginationItemProps {
    value: number
    disabled?: boolean
    id?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPaginationItem' })

  const { value, disabled = false, id } = defineProps<EmPaginationItemProps>()
</script>

<template>
  <PaginationItem
    :id
    class="emerald-pagination__item"
    :disabled
    :value
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PaginationItem>
</template>

<style>
.emerald-pagination__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 32px;
  height: 28px;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s);
  background: transparent;
  border: var(--emerald-stroke-s) solid transparent;
  border-radius: var(--emerald-radius-xs);
  color: inherit;
  font: inherit;
  text-align: center;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
}

.emerald-pagination__item[data-selected] {
  background: var(--emerald-primary-100);
  border-color: var(--emerald-primary-600);
  font-weight: var(--emerald-text-b2-bold-weight);
}

.emerald-pagination__item:hover:not([data-disabled]):not([data-selected]) {
  background: var(--emerald-neutral-200);
}

.emerald-pagination__item:focus-visible {
  outline: none;
  box-shadow: var(--emerald-shadow-focus);
}

.emerald-pagination__item[data-disabled] {
  color: var(--emerald-neutral-400);
  cursor: not-allowed;
}
</style>
