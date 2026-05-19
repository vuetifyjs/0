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
  height: 24px;
  padding: 4px 12px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: normal;
  color: var(--emerald-primary-950, #221065);
  background: transparent;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 220ms cubic-bezier(0.4, 0.0, 0.2, 1),
    color 220ms cubic-bezier(0.4, 0.0, 0.2, 1),
    box-shadow 220ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.emerald-tabs__item:hover:not([data-disabled]):not([data-selected]) {
  background: rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.08);
  color: var(--emerald-primary-900, #361d95);
}

.emerald-tabs__item[data-selected] {
  background: var(--emerald-primary-500, #7c5cf6);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 1px 2px 0 rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.25);
}

.emerald-tabs__item[data-disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}

.emerald-tabs__item:focus-visible {
  outline: 2px solid var(--emerald-primary-500, #7c5cf6);
  outline-offset: 2px;
  z-index: 1;
}

[aria-orientation="vertical"] > .emerald-tabs__item {
  width: 100%;
  justify-content: flex-start;
}
</style>
