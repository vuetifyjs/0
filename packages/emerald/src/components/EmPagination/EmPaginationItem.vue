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
  min-width: 28px;
  height: 28px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  color: inherit;
  font: inherit;
  text-align: center;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
}

.emerald-pagination__item[data-selected] {
  background: var(--emerald-background, #ffffff);
  border-color: var(--emerald-secondary-500);
  color: inherit;
}

.emerald-pagination__item:hover:not([data-disabled]):not([data-selected]) {
  background: rgb(var(--emerald-primary-500-channels) / 0.08);
}

.emerald-pagination__item:focus-visible {
  outline: 2px solid var(--emerald-primary-500);
  outline-offset: 2px;
}

.emerald-pagination__item[data-disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
