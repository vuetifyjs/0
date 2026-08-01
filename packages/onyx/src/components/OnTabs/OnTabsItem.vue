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
    border: none;
    border-radius: var(--onyx-radius-sm, 0.25rem);
    color: var(--onyx-muted-foreground, #a1a1aa);
    cursor: pointer;
    display: inline-flex;
    font-size: var(--onyx-text-sm-size, 13px);
    font-weight: 500;
    justify-content: center;
    line-height: var(--onyx-text-sm-height, 18px);
    padding: var(--onyx-spacing-3xs, 2px) var(--onyx-spacing-sm, 12px);
    transition: background-color var(--onyx-motion-fast, 120ms), color var(--onyx-motion-fast, 120ms), box-shadow var(--onyx-motion-fast, 120ms);
  }

  .onyx-tabs__item[data-selected] {
    background: var(--onyx-background, #09090b);
    box-shadow: var(--onyx-shadow-xs, 0 1px 2px 0 rgb(0 0 0 / 0.05));
    color: var(--onyx-foreground, #fafafa);
  }

  .onyx-tabs__item[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .onyx-tabs__item:focus-visible {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--onyx-ring, #71717a) 50%, transparent);
    outline: none;
  }
</style>
