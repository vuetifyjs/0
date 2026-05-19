<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmListProps extends V0PaperProps {
    flat?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmList' })

  const { flat = false, ...paperProps } = defineProps<EmListProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="ul"
    class="emerald-list"
    :data-flat="flat || undefined"
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
  padding: 12px;
  list-style: none;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  background: var(--emerald-background, #faf9ff);
  border: 1px solid rgb(var(--emerald-on-background-channels, 26 18 48) / 0.1);
  border-radius: 12px;
  box-shadow:
    0 3px 6px 0 rgba(5, 0, 18, 0.09),
    0 8px 20px 0 rgba(5, 0, 18, 0.13);
  color: var(--emerald-on-background, #281065);
  width: 100%;
}

.emerald-list[data-flat] {
  border: none;
  box-shadow: none;
  background: transparent;
  padding: 0;
}

.emerald-list__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 36px;
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--emerald-on-background, #281065);
  cursor: default;
  box-sizing: border-box;
  overflow: hidden;
}

.emerald-list__item[data-interactive] {
  cursor: pointer;
}

.emerald-list__item[data-interactive]:not([data-active]):hover {
  background: var(--emerald-primary-50, #f5f3ff);
}

.emerald-list__item[data-active] {
  background: var(--emerald-primary-100, #ede9fe);
}

.emerald-list__item[data-active] .emerald-list__item-title,
.emerald-list__item[data-active] .emerald-list__item-icon {
  color: var(--emerald-primary-500, #7c5cf6);
  font-weight: 500;
}

.emerald-list__item[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}

/* Subtle left border indicator on default (non-active, non-header) items */
.emerald-list__item[data-indent] {
  border-left: 0.5px solid rgb(var(--emerald-on-background-channels, 26 18 48) / 0.1);
  border-radius: 0;
}

.emerald-list__item-icon {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--emerald-on-background, #281065);
}

.emerald-list__item-action {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  color: var(--emerald-on-background, #281065);
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
  font-size: 14px;
  font-weight: 400;
  line-height: 1.3;
  color: var(--emerald-on-background, #281065);
}

.emerald-list__item-subtitle {
  font-family: inherit;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  color: var(--emerald-on-background, #281065);
}

.emerald-list__item-header {
  align-items: flex-start;
  height: auto;
  padding: 8px 12px;
}

.emerald-list__item-header .emerald-list__item-title {
  font-size: 16px;
  font-weight: 700;
}

.emerald-list__subheader {
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  padding: 8px 12px 8px 0;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--emerald-on-background, #281065);
  opacity: 0.7;
  text-transform: uppercase;
  box-sizing: border-box;
}

.emerald-list__separator {
  width: calc(100% - 16px);
  height: 0;
  margin: 8px 8px 0;
  border: none;
  border-top: 0.5px solid rgb(var(--emerald-on-background-channels, 26 18 48) / 0.1);
}
</style>
