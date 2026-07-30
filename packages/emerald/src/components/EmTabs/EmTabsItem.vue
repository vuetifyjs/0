<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface EmTabsItemProps {
    value: ID
    disabled?: boolean
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTabsItem' })

  const { value, disabled = false, namespace } = defineProps<EmTabsItemProps>()
</script>

<template>
  <Tabs.Item class="emerald-tabs__item" :disabled :namespace :value>
    <slot />
  </Tabs.Item>
</template>

<style>
  .emerald-tabs__item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--emerald-spacing-2xs, 4px);
    padding:
      calc(var(--emerald-spacing-xs, 8px) - var(--emerald-stroke-s, 1px))
      calc(var(--emerald-spacing-s, 12px) - var(--emerald-stroke-s, 1px));
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: var(--emerald-text-b2-weight, 400);
    line-height: var(--emerald-text-b2-height, 21px);
    color: var(--emerald-on-surface, #2b2d2e);
    background: var(--emerald-neutral-200, #ebf0f4);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: 0;
    cursor: pointer;
    white-space: nowrap;
    transition:
      background-color var(--emerald-motion-duration-slow, 220ms) var(--emerald-motion-ease-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      border-color var(--emerald-motion-duration-slow, 220ms) var(--emerald-motion-ease-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--emerald-motion-duration-slow, 220ms) var(--emerald-motion-ease-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .emerald-tabs[data-orientation='horizontal'] .emerald-tabs__item + .emerald-tabs__item,
  .emerald-tabs:not([data-orientation]) .emerald-tabs__item + .emerald-tabs__item {
    margin-inline-start: calc(-1 * var(--emerald-stroke-s, 1px));
  }

  .emerald-tabs[data-orientation='vertical'] .emerald-tabs__item + .emerald-tabs__item {
    margin-block-start: calc(-1 * var(--emerald-stroke-s, 1px));
  }

  .emerald-tabs[data-orientation='horizontal'] .emerald-tabs__item:first-child,
  .emerald-tabs:not([data-orientation]) .emerald-tabs__item:first-child {
    border-start-start-radius: var(--emerald-radius-s, 6px);
    border-end-start-radius: var(--emerald-radius-s, 6px);
  }

  .emerald-tabs[data-orientation='horizontal'] .emerald-tabs__item:last-child,
  .emerald-tabs:not([data-orientation]) .emerald-tabs__item:last-child {
    border-start-end-radius: var(--emerald-radius-s, 6px);
    border-end-end-radius: var(--emerald-radius-s, 6px);
  }

  .emerald-tabs[data-orientation='vertical'] .emerald-tabs__item:first-child {
    border-start-start-radius: var(--emerald-radius-s, 6px);
    border-start-end-radius: var(--emerald-radius-s, 6px);
  }

  .emerald-tabs[data-orientation='vertical'] .emerald-tabs__item:last-child {
    border-end-start-radius: var(--emerald-radius-s, 6px);
    border-end-end-radius: var(--emerald-radius-s, 6px);
  }

  .emerald-tabs__item:hover:not([data-disabled]):not([data-selected]) {
    background: var(--emerald-primary-400, #94caab);
    border-color: var(--emerald-primary-500, #6fb38c);
    z-index: 1;
  }

  .emerald-tabs__item[data-selected] {
    background: var(--emerald-primary-200, #d6f3e2);
    border-color: var(--emerald-primary-500, #6fb38c);
    z-index: 2;
  }

  .emerald-tabs__item[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .emerald-tabs__item:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: 0;
    z-index: 3;
  }
</style>
