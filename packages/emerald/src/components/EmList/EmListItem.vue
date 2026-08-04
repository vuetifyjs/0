<script lang="ts">
  // Framework
  import { Single } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface EmListItemProps {
    value: ID
    disabled?: boolean
    namespace?: string
    /**
     * Host element for the row. The default `button` is the selectable row;
     * pass a non-interactive host for rows that carry their own controls
     * (a star toggle, an overflow menu) which may not nest inside a button.
     */
    as?: string
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'EmListItem', inheritAttrs: false })

  const {
    value,
    disabled = false,
    namespace,
    as = 'button',
  } = defineProps<EmListItemProps>()

  const interactive = toRef(() => as === 'button')
</script>

<template>
  <li class="emerald-list__row">
    <Single.Item
      v-slot="item"
      :disabled
      :namespace
      :value
    >
      <!-- Item state hooks only: role="option" is withheld because the list is
           not a listbox (no roving focus or typeahead yet) — a bare option
           outside a listbox is worse than an honest button. -->
      <component
        :is="as"
        v-bind="$attrs"
        :aria-current="item.isSelected || undefined"
        class="emerald-list__item"
        :data-disabled="item.isDisabled || undefined"
        :data-selected="item.isSelected || undefined"
        :disabled="(interactive && item.isDisabled) || undefined"
        :type="interactive ? 'button' : undefined"
        v-on="interactive ? { click: item.attrs.onClick } : {}"
      >
        <slot />
      </component>
    </Single.Item>
  </li>
</template>

<style>
  .emerald-list__row {
    min-width: 0;
  }

  .emerald-list__item {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    border: none;
    border-radius: var(--emerald-radius-m, 8px);
    background: transparent;
    color: var(--emerald-on-surface, #2b2d2e);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: var(--emerald-text-b2-weight, 400);
    line-height: var(--emerald-text-b2-height, 21px);
    text-align: start;
    transition: background-color var(--emerald-motion-duration-fast, 120ms) var(--emerald-motion-ease-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  button.emerald-list__item {
    cursor: pointer;
  }

  .emerald-list__item:hover:not([data-disabled]) {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .emerald-list__item[data-selected] {
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-800, #01603a);
  }

  .emerald-list__item[data-unread] .emerald-list__title {
    color: var(--emerald-on-surface, #2b2d2e);
    font-weight: 700;
  }

  .emerald-list__item[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .emerald-list__item:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: -2px;
  }
</style>
