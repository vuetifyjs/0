<script lang="ts">
  // Framework
  import { Select } from '@vuetify/v0'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface EmSelectItemProps {
    value: ID
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelectItem' })

  const {
    value,
    disabled = false,
  } = defineProps<EmSelectItemProps>()
</script>

<template>
  <Select.Item class="emerald-select__item" :disabled :value>
    <slot />
  </Select.Item>
</template>

<style>
  .emerald-select__item {
    display: flex;
    align-items: center;
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    border-left: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: 0 var(--emerald-radius-xs, 4px) var(--emerald-radius-xs, 4px) 0;
    background: var(--emerald-neutral-100, #fefefe);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: var(--emerald-text-b1-weight, 400);
    line-height: var(--emerald-text-b1-height, 24px);
    color: var(--emerald-on-surface, #2b2d2e);
    cursor: pointer;
    user-select: none;
    transition: background-color 120ms ease, border-color 120ms ease;
  }

  .emerald-select__item[data-focused],
  .emerald-select__item:hover {
    background: var(--emerald-neutral-200, #ebf0f4);
    border-left-color: var(--emerald-neutral-600, #939dac);
  }

  .emerald-select__item[data-selected] {
    background: var(--emerald-primary-100, #e7fff2);
    border-left-color: var(--emerald-primary-600, #1fae60);
  }

  .emerald-select__item[data-disabled] {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
