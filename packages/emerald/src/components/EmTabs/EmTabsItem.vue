<script lang="ts">
  // Framework
  import { TabsItem } from '@vuetify/v0'

  // Types
  import type { ID } from '@vuetify/v0'

  export interface EmTabsItemProps<V = unknown> {
    id?: ID
    value?: V
    disabled?: boolean
  }
</script>

<script setup lang="ts" generic="V = unknown">
  defineOptions({ name: 'EmTabsItem' })

  const { id, value, disabled = false } = defineProps<EmTabsItemProps<V>>()
</script>

<template>
  <TabsItem
    :id
    class="emerald-tabs__item"
    :disabled
    :value
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </TabsItem>
</template>

<style>
.emerald-tabs__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 6px 14px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: var(--emerald-primary-950, #221065);
  background: var(--emerald-primary-50, #f5f3ff);
  border-top: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-bottom: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-left: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-right: none;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 220ms cubic-bezier(0.4, 0.0, 0.2, 1),
    color 220ms cubic-bezier(0.4, 0.0, 0.2, 1),
    box-shadow 220ms cubic-bezier(0.4, 0.0, 0.2, 1),
    transform 220ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.emerald-tabs__item:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.emerald-tabs__item:last-child {
  border-right: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.emerald-tabs__item:hover:not([data-disabled]):not([data-selected]) {
  background: var(--emerald-primary-100, #ede9fe);
  color: var(--emerald-primary-900, #361d95);
}

.emerald-tabs__item[data-selected] {
  background: var(--emerald-primary-500, #7c5cf6);
  color: #ffffff;
  font-weight: 600;
  box-shadow:
    inset 0 1px 2px 0 rgb(0 0 0 / 0.12),
    0 1px 2px 0 rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.25);
}

.emerald-tabs__item[data-disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}

.emerald-tabs__item:focus-visible {
  outline: 2px solid var(--emerald-primary-500, #7c5cf6);
  outline-offset: -1px;
  z-index: 1;
}

[aria-orientation="vertical"] > .emerald-tabs__item {
  border-left: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-right: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-top: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-bottom: none;
}

[aria-orientation="vertical"] > .emerald-tabs__item:first-child {
  border-radius: 6px 6px 0 0;
}

[aria-orientation="vertical"] > .emerald-tabs__item:last-child {
  border-bottom: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 0 0 6px 6px;
}
</style>
