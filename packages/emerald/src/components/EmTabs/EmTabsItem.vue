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

<script lang="ts" setup generic="V = unknown">
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

<style scoped>
.emerald-tabs__item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--emerald-spacing-2xs);
  /* Spec strokes render inside: subtract the border so tabs keep 8x12 visual padding and a 37px height */
  padding:
    calc(var(--emerald-spacing-xs) - var(--emerald-stroke-s))
    calc(var(--emerald-spacing-s) - var(--emerald-stroke-s));
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b2-size);
  font-weight: var(--emerald-text-b2-weight);
  line-height: var(--emerald-text-b2-height);
  color: var(--emerald-on-surface);
  background: var(--emerald-neutral-200);
  border: var(--emerald-stroke-s) solid var(--emerald-neutral-300);
  border-radius: 0;
  cursor: pointer;
  white-space: nowrap;
  transition:
    background-color 220ms cubic-bezier(0.4, 0, 0.2, 1),
    border-color 220ms cubic-bezier(0.4, 0, 0.2, 1),
    color 220ms cubic-bezier(0.4, 0, 0.2, 1);
}

.emerald-tabs__item + .emerald-tabs__item {
  margin-inline-start: calc(-1 * var(--emerald-stroke-s));
}

.emerald-tabs__item:first-child {
  border-start-start-radius: var(--emerald-radius-s);
  border-end-start-radius: var(--emerald-radius-s);
}

.emerald-tabs__item:last-child {
  border-start-end-radius: var(--emerald-radius-s);
  border-end-end-radius: var(--emerald-radius-s);
}

.emerald-tabs__item:hover:not([data-disabled]):not([data-selected]) {
  background: var(--emerald-primary-400);
  border-color: var(--emerald-primary-500);
  z-index: 1;
}

.emerald-tabs__item[data-selected] {
  background: var(--emerald-primary-200);
  border-color: var(--emerald-primary-500);
  z-index: 2;
}

.emerald-tabs__item[data-disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}

.emerald-tabs__item:focus-visible {
  outline: var(--emerald-stroke-m) solid var(--emerald-primary-600);
  outline-offset: 0;
  z-index: 3;
}

[aria-orientation="vertical"] > .emerald-tabs__item {
  justify-content: flex-start;
}

[aria-orientation="vertical"] > .emerald-tabs__item + .emerald-tabs__item {
  margin-inline-start: 0;
  margin-block-start: calc(-1 * var(--emerald-stroke-s));
}

[aria-orientation="vertical"] > .emerald-tabs__item:first-child {
  border-radius: 0;
  border-start-start-radius: var(--emerald-radius-s);
  border-start-end-radius: var(--emerald-radius-s);
}

[aria-orientation="vertical"] > .emerald-tabs__item:last-child {
  border-radius: 0;
  border-end-start-radius: var(--emerald-radius-s);
  border-end-end-radius: var(--emerald-radius-s);
}
</style>
