<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  export interface OnTabsItemProps {
    disabled?: boolean
    value: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnTabsItem' })

  const { disabled = false, value } = defineProps<OnTabsItemProps>()
</script>

<template>
  <Tabs.Item class="onyx-tabs__item" :disabled :value>
    <slot />
  </Tabs.Item>
</template>

<!-- Unscoped: Tabs.Item is a compound child from v0's own file scope; scoped data-v
     never reaches its root (mirrors the OnButton/Button.Root case). -->
<style>
  .onyx-tabs__item {
    align-items: center;
    background: transparent;
    border: var(--onyx-stroke-s, 1px) solid transparent;
    border-radius: calc(var(--onyx-radius-lg, 0.5rem) - 2px);
    color: var(--onyx-muted-foreground, #bab3ab);
    cursor: pointer;
    display: inline-flex;
    font-size: var(--onyx-text-sm-size, 13.5px);
    font-weight: 550;
    height: calc(var(--onyx-control-md, 36px) - 8px);
    justify-content: center;
    padding: 0 var(--onyx-spacing-sm, 12px);
    transition: background-color var(--onyx-motion-fast, 120ms) var(--onyx-motion-lamp, cubic-bezier(0.4, 0, 0.2, 1)),
                box-shadow var(--onyx-motion-fast, 120ms) var(--onyx-motion-lamp, cubic-bezier(0.4, 0, 0.2, 1)),
                color var(--onyx-motion-fast, 120ms) var(--onyx-motion-lamp, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .onyx-tabs__item:hover:not([data-selected]):not([data-disabled]) {
    color: var(--onyx-foreground, #f0ece5);
  }

  /* Selected: lifted out of the trough and given the champagne girdle. */
  .onyx-tabs__item[data-selected] {
    background: var(--onyx-band), var(--onyx-surface-raised, #211c19);
    border-color: var(--onyx-border, #2f2925);
    box-shadow: var(--onyx-girdle-active), 0 1px 2px -1px rgb(8 6 5 / 0.6);
    color: var(--onyx-foreground, #f0ece5);
  }

  /* Explicit disabled colors, never opacity (graft — see OnButton's [data-disabled] comment). */
  .onyx-tabs__item[data-disabled] {
    color: color-mix(in oklab, var(--onyx-muted-foreground, #bab3ab) 55%, var(--onyx-intaglio, #090605));
    cursor: not-allowed;
  }

  .onyx-tabs__item:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--onyx-ring, #dac593) 85%, transparent);
    outline-offset: 2px;
  }
</style>
