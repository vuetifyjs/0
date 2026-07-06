<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmListProps extends V0PaperProps {
    flat?: boolean
    rail?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmList' })

  const { flat = false, rail = false, ...paperProps } = defineProps<EmListProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="ul"
    class="emerald-list"
    :data-flat="flat || undefined"
    :data-rail="rail || undefined"
    role="list"
  >
    <slot />
  </V0Paper>
</template>

<style>
.emerald-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0;
  padding: var(--emerald-spacing-s);
  list-style: none;
  font-family: var(--emerald-font-sans);
  background: var(--emerald-background);
  border: var(--emerald-stroke-s) solid var(--emerald-neutral-alpha-gray-20);
  border-radius: var(--emerald-radius-xl);
  box-shadow: var(--emerald-shadow-m);
  color: var(--emerald-on-surface);
  width: 100%;
}

.emerald-list[data-flat] {
  border: none;
  box-shadow: none;
  background: transparent;
  padding: 0;
}

/* Collapsed icon-only rail (Sidebar-menu "closed" variant) */
.emerald-list[data-rail] {
  width: max-content;
}

.emerald-list[data-rail] .emerald-list__item-body,
.emerald-list[data-rail] .emerald-list__item-action,
.emerald-list[data-rail] .emerald-list__subheader {
  display: none;
}

.emerald-list__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--emerald-spacing-xs);
  width: 100%;
  min-height: 36px;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s);
  border-radius: var(--emerald-radius-s);
  color: var(--emerald-on-surface);
  cursor: default;
  box-sizing: border-box;
  overflow: hidden;
}

.emerald-list__item[data-interactive] {
  cursor: pointer;
}

.emerald-list__item[data-interactive]:not([data-active]):hover {
  background: var(--emerald-neutral-200);
}

.emerald-list__item[data-interactive]:focus-visible {
  outline: var(--emerald-stroke-m) solid var(--emerald-primary-600);
  outline-offset: -2px;
}

.emerald-list__item[data-active] {
  background: var(--emerald-primary-100);
}

.emerald-list__item[data-disabled] {
  color: var(--emerald-neutral-400);
  pointer-events: none;
}

/* Subtle start border indicator on default (non-active, non-header) items */
.emerald-list__item[data-indent] {
  border-inline-start: var(--emerald-stroke-s) solid var(--emerald-divider);
  border-radius: 0;
}

.emerald-list__item-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--emerald-icon-xl);
  height: var(--emerald-icon-xl);
  padding: var(--emerald-spacing-2xs);
  box-sizing: border-box;
  color: var(--emerald-on-surface);
}

.emerald-list__item-indicator {
  flex-shrink: 0;
  width: var(--emerald-spacing-xs);
  height: var(--emerald-spacing-xs);
  border-radius: var(--emerald-radius-full);
  background: var(--emerald-primary-600);
}

.emerald-list__item-action {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-inline-start: auto;
  color: var(--emerald-on-surface);
}

.emerald-list__item-body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 0;
}

.emerald-list__item-title {
  font-family: inherit;
  font-size: var(--emerald-text-b2-size);
  font-weight: 600;
  line-height: var(--emerald-text-b2-height);
  color: var(--emerald-on-surface);
}

.emerald-list__item-subtitle {
  font-family: inherit;
  font-size: var(--emerald-text-b3-size);
  font-weight: var(--emerald-text-b3-weight);
  line-height: var(--emerald-text-b3-height);
  color: var(--emerald-on-surface);
}

.emerald-list__item-header {
  align-items: flex-start;
  height: auto;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s);
}

.emerald-list__item-header .emerald-list__item-title {
  font-size: var(--emerald-text-b1-size);
  font-weight: 700;
  line-height: var(--emerald-text-b1-height);
}

.emerald-list__subheader {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 36px;
  padding-block: var(--emerald-spacing-xs);
  padding-inline: 0 var(--emerald-spacing-s);
  font-family: inherit;
  font-size: var(--emerald-text-b3-size);
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--emerald-on-surface);
  opacity: 0.7;
  text-transform: uppercase;
  box-sizing: border-box;
}

.emerald-list__separator {
  width: calc(100% - var(--emerald-spacing-m));
  height: 0;
  margin: var(--emerald-spacing-xs) var(--emerald-spacing-xs) 0;
  border: none;
  border-top: var(--emerald-stroke-s) solid var(--emerald-divider);
}

/* Collapsible group (Sidebar-menu "subitem" variant) */
.emerald-list__group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.emerald-list__group-activator {
  display: flex;
  align-items: center;
  gap: var(--emerald-spacing-xs);
  width: 100%;
  min-height: 36px;
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s);
  background: transparent;
  border: none;
  border-radius: var(--emerald-radius-s);
  font: inherit;
  color: inherit;
  text-align: start;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
}

.emerald-list__group-activator:not([data-disabled]):hover {
  background: var(--emerald-neutral-200);
}

.emerald-list__group-activator:focus-visible {
  outline: var(--emerald-stroke-m) solid var(--emerald-primary-600);
  outline-offset: -2px;
}

.emerald-list__group-activator[data-disabled] {
  color: var(--emerald-neutral-400);
  cursor: not-allowed;
}

.emerald-list__group-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
