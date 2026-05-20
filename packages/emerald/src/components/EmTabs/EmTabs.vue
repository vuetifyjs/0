<script lang="ts">
  // Framework
  import { Atom, TabsRoot } from '@vuetify/v0'

  // Types
  import type { AtomProps, TabsActivation } from '@vuetify/v0'

  export type EmTabsOrientation = 'horizontal' | 'vertical'
  export type EmTabsVariant = 'segmented' | 'line' | 'pill' | 'boxed' | 'vertical'

  export interface EmTabsProps extends AtomProps {
    disabled?: boolean
    mandatory?: boolean | 'force'
    circular?: boolean
    orientation?: EmTabsOrientation
    activation?: TabsActivation
    variant?: EmTabsVariant
  }
</script>

<script setup lang="ts" generic="T">
  defineOptions({ name: 'EmTabs' })

  const {
    disabled = false,
    mandatory = 'force',
    circular = true,
    orientation = 'horizontal',
    activation = 'automatic',
    variant = 'segmented',
    as = 'div',
    renderless = false,
  } = defineProps<EmTabsProps>()

  const model = defineModel<T | T[]>()

  const resolvedOrientation = variant === 'vertical' ? 'vertical' : orientation
</script>

<template>
  <Atom
    :as
    class="emerald-tabs"
    :data-disabled="disabled || undefined"
    :data-orientation="resolvedOrientation"
    :data-variant="variant"
    :renderless
  >
    <TabsRoot
      v-model="model"
      :activation
      :circular
      :disabled
      :mandatory
      :orientation="resolvedOrientation"
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </TabsRoot>
  </Atom>
</template>

<style>
.emerald-tabs {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: var(--emerald-primary-950, #221065);
}

.emerald-tabs[data-orientation="vertical"] {
  flex-direction: row;
}

/* segmented variant: connected button group, Figma-canonical */
.emerald-tabs[data-variant="segmented"] .emerald-tabs__list {
  display: inline-flex;
  align-items: center;
  gap: 0;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 6px;
  width: fit-content;
  overflow: visible;
}

.emerald-tabs[data-variant="segmented"] .emerald-tabs__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 8px 16px;
  border: none;
  border-radius: 0;
  background: var(--emerald-primary-50, #f5f3ff);
  color: var(--emerald-primary-700, #4f30c4);
  font-weight: 500;
  box-shadow: none;
  position: relative;
  transition:
    background-color 180ms cubic-bezier(0.4, 0.0, 0.2, 1),
    color 180ms cubic-bezier(0.4, 0.0, 0.2, 1),
    height 180ms cubic-bezier(0.4, 0.0, 0.2, 1),
    box-shadow 180ms cubic-bezier(0.4, 0.0, 0.2, 1),
    margin 180ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.emerald-tabs[data-variant="segmented"] .emerald-tabs__list > .emerald-tabs__item:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.emerald-tabs[data-variant="segmented"] .emerald-tabs__list > .emerald-tabs__item:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.emerald-tabs[data-variant="segmented"] .emerald-tabs__item[data-selected] {
  background: var(--emerald-primary-200, #ded6fe);
  color: var(--emerald-primary-700, #4f30c4);
  box-shadow: none;
}

.emerald-tabs[data-variant="segmented"] .emerald-tabs__item:hover:not([data-disabled]):not([data-selected]) {
  background: var(--emerald-primary-300, #c4b5fd);
  color: var(--emerald-primary-700, #4f30c4);
  height: 36px;
  margin-block: -2px;
  z-index: 1;
  box-shadow:
    0 3px 4px rgb(5 0 18 / 0.13),
    0 2px 2px rgb(5 0 18 / 0.10);
}

/* line variant: minimal, underline indicator */
.emerald-tabs[data-variant="line"] .emerald-tabs__list {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 0;
  padding: 0;
  gap: 0;
  width: 100%;
}

.emerald-tabs[data-variant="line"] .emerald-tabs__item {
  border-radius: 0;
  background: transparent;
  color: var(--emerald-primary-950, #221065);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  padding: 8px 12px;
  height: auto;
  box-shadow: none;
}

.emerald-tabs[data-variant="line"] .emerald-tabs__item[data-selected] {
  background: transparent;
  color: var(--emerald-primary-500, #7c5cf6);
  border-bottom-color: var(--emerald-primary-500, #7c5cf6);
  box-shadow: none;
}

.emerald-tabs[data-variant="line"] .emerald-tabs__item:hover:not([data-disabled]):not([data-selected]) {
  background: transparent;
  color: var(--emerald-primary-700, #4f30c4);
  border-bottom-color: rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.4);
}

/* pill variant: rounded pill, primary fill on active */
.emerald-tabs[data-variant="pill"] .emerald-tabs__list {
  background: transparent;
  border: none;
  padding: 0;
  gap: 8px;
}

.emerald-tabs[data-variant="pill"] .emerald-tabs__item {
  border-radius: 9999px;
  padding: 6px 16px;
  height: auto;
}

/* boxed variant: card-like boxes */
.emerald-tabs[data-variant="boxed"] .emerald-tabs__list {
  background: transparent;
  border: none;
  padding: 0;
  gap: 8px;
}

.emerald-tabs[data-variant="boxed"] .emerald-tabs__item {
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.15);
  border-radius: 8px;
  background: transparent;
  padding: 8px 16px;
  height: auto;
}

.emerald-tabs[data-variant="boxed"] .emerald-tabs__item[data-selected] {
  background: var(--emerald-primary-500, #7c5cf6);
  border-color: var(--emerald-primary-500, #7c5cf6);
  color: #ffffff;
}

/* vertical variant: column layout, left border indicator */
.emerald-tabs[data-variant="vertical"] {
  flex-direction: row;
}

.emerald-tabs[data-variant="vertical"] .emerald-tabs__list {
  flex-direction: column;
  align-items: stretch;
  background: transparent;
  border: none;
  border-left: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 0;
  padding: 0;
  gap: 0;
  width: auto;
  min-width: 160px;
}

.emerald-tabs[data-variant="vertical"] .emerald-tabs__item {
  justify-content: flex-start;
  width: 100%;
  border-radius: 0;
  background: transparent;
  color: var(--emerald-primary-950, #221065);
  border-left: 2px solid transparent;
  margin-left: -1px;
  padding: 8px 16px;
  height: auto;
  box-shadow: none;
}

.emerald-tabs[data-variant="vertical"] .emerald-tabs__item[data-selected] {
  background: rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.08);
  color: var(--emerald-primary-500, #7c5cf6);
  border-left-color: var(--emerald-primary-500, #7c5cf6);
  box-shadow: none;
}

.emerald-tabs[data-variant="vertical"] .emerald-tabs__item:hover:not([data-disabled]):not([data-selected]) {
  background: rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.04);
  color: var(--emerald-primary-700, #4f30c4);
}
</style>
