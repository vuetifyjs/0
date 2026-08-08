<script lang="ts">
  // Framework
  import { Pagination } from '@vuetify/v0'

  export interface EmPaginationItemProps {
    value: number
    disabled?: boolean
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPaginationItem' })

  const { value, disabled = false, namespace } = defineProps<EmPaginationItemProps>()
</script>

<template>
  <Pagination.Item
    v-slot="slotProps"
    class="emerald-pagination__item"
    :disabled
    :namespace
    :value
  >
    <slot v-bind="slotProps">{{ slotProps.page }}</slot>
  </Pagination.Item>
</template>

<style>
  .emerald-pagination__item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-width: 32px;
    height: 28px;
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    background: transparent;
    border: var(--emerald-stroke-s, 1px) solid transparent;
    border-radius: var(--emerald-radius-xs, 4px);
    color: inherit;
    font: inherit;
    cursor: pointer;
    transition: background-color var(--emerald-motion-duration-fast, 120ms) ease, border-color var(--emerald-motion-duration-fast, 120ms) ease;
  }

  .emerald-pagination__item[data-selected] {
    background: var(--emerald-primary-100, #e7fff2);
    border-color: var(--emerald-primary-600, #1fae60);
    font-weight: var(--emerald-text-b2-bold-weight, 600);
  }

  .emerald-pagination__item:hover:not([data-disabled]):not([data-selected]) {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .emerald-pagination__item:focus-visible {
    outline: none;
    box-shadow: var(--emerald-shadow-focus, 0 0 0 5px rgba(38, 194, 109, 0.2));
  }

  .emerald-pagination__item[data-disabled] {
    color: var(--emerald-neutral-400, #aeb6be);
    cursor: not-allowed;
  }
</style>
