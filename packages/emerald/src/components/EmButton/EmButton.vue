<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Context
  import EmButtonLoader from './EmButtonLoader.vue'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export type EmButtonSize = 'sm' | 'md' | 'lg'

  export type EmButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'

  export interface EmButtonProps extends AtomProps {
    disabled?: boolean
    loading?: boolean
    size?: EmButtonSize
    variant?: EmButtonVariant
    type?: 'button' | 'submit' | 'reset'
    href?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmButton' })

  const {
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    type = 'button',
    href,
    ...paperProps
  } = defineProps<EmButtonProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    if (disabled || loading) return

    emit('click', event)
  }
</script>

<template>
  <Atom
    v-bind="paperProps"
    :aria-busy="loading || undefined"
    :aria-disabled="(disabled || loading) || undefined"
    :as="href ? 'a' : 'button'"
    class="emerald-button"
    :data-disabled="(disabled || loading) || undefined"
    :data-loading="loading || undefined"
    :data-size="size"
    :data-variant="variant"
    :disabled="(disabled || loading) || undefined"
    :href
    :type="href ? undefined : type"
    @click="onClick"
  >
    <span v-if="loading" class="emerald-button__loading">
      <EmButtonLoader />
    </span>

    <span :class="['emerald-button__content', loading && 'emerald-button__content--hidden']">
      <slot />
    </span>
  </Atom>
</template>

<style scoped>
.emerald-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;
  background: transparent;
  color: inherit;
  box-shadow: none;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease, box-shadow 120ms ease, transform 80ms ease;
}

.emerald-button[data-size="sm"] {
  padding: 4.5px 9px;
  border-radius: 3px;
  font-size: 10.5px;
  line-height: 15px;
  gap: 6px;
}

.emerald-button[data-size="md"] {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
  gap: 8px;
}

.emerald-button[data-size="lg"] {
  padding: 7.5px 15px;
  border-radius: 5px;
  font-size: 17.5px;
  line-height: 25px;
  gap: 10px;
}

/* ─── Variant: primary (default) ──────────────────────── */
.emerald-button[data-variant="primary"] {
  background: var(--emerald-primary-500);
  color: var(--emerald-primary-100);
}

.emerald-button[data-variant="primary"]:hover:not([data-disabled]):not(:active) {
  background: var(--emerald-primary-700);
  color: var(--emerald-primary-200);
  box-shadow:
    0 2px 4px 0 rgb(var(--emerald-primary-700-channels) / 0.32),
    0 3px 8px 0 rgb(var(--emerald-primary-700-channels) / 0.22);
}

.emerald-button[data-variant="primary"]:active:not([data-disabled]) {
  background: var(--emerald-primary-900);
  color: var(--emerald-primary-100);
}

.emerald-button[data-variant="primary"]:focus-visible {
  outline: 2px solid var(--emerald-primary-500);
  outline-offset: 2px;
}

/* ─── Variant: secondary ──────────────────────────────── */
.emerald-button[data-variant="secondary"] {
  background: #ffffff;
  color: var(--emerald-secondary-600, #828fa9);
  border-color: var(--emerald-secondary-100, #ecf0f3);
}

.emerald-button[data-variant="secondary"]:hover:not([data-disabled]):not(:active) {
  background: #ffffff;
  color: var(--emerald-secondary-700, #6f7a93);
  border-color: var(--emerald-secondary-200, #dce4e9);
}

.emerald-button[data-variant="secondary"]:active:not([data-disabled]) {
  background: var(--emerald-secondary-100, #ecf0f3);
  color: var(--emerald-secondary-700, #6f7a93);
  border-color: var(--emerald-secondary-500, #94a3b8);
}

.emerald-button[data-variant="secondary"]:focus-visible {
  outline: 2px solid var(--emerald-secondary-500, #94a3b8);
  outline-offset: 2px;
}

/* ─── Variant: ghost ──────────────────────────────────── */
.emerald-button[data-variant="ghost"] {
  background: transparent;
  color: var(--emerald-secondary-700, #6f7a93);
  border-color: transparent;
}

.emerald-button[data-variant="ghost"]:hover:not([data-disabled]):not(:active) {
  background: var(--emerald-secondary-50, #f4f7f9);
  color: var(--emerald-secondary-900, #4d5462);
}

.emerald-button[data-variant="ghost"]:active:not([data-disabled]) {
  background: var(--emerald-secondary-100, #ecf0f3);
  color: var(--emerald-secondary-950, #2d3139);
}

.emerald-button[data-variant="ghost"]:focus-visible {
  outline: 2px solid var(--emerald-secondary-400, #aebccb);
  outline-offset: 2px;
}

/* ─── Variant: destructive ────────────────────────────── */
/* NOTE: Figma error/base = #c0392b. Emerald --error-500 currently resolves to
   #e35e50 which is too light. Hardcoding #c0392b until the error scale is
   reconciled with Figma tokens. */
.emerald-button[data-variant="destructive"] {
  background: #c0392b;
  color: #ffffff;
}

.emerald-button[data-variant="destructive"]:hover:not([data-disabled]):not(:active) {
  background: #ad3327;
  color: #ffffff;
  box-shadow:
    0 2px 4px 0 rgb(192 57 43 / 0.32),
    0 3px 8px 0 rgb(192 57 43 / 0.22);
}

.emerald-button[data-variant="destructive"]:active:not([data-disabled]) {
  background: #9a2e22;
  color: #ffffff;
}

.emerald-button[data-variant="destructive"]:focus-visible {
  outline: 2px solid #c0392b;
  outline-offset: 2px;
}

/* ─── Shared interaction states ───────────────────────── */
.emerald-button:active:not([data-disabled]) {
  transform: scale(0.95);
  box-shadow: none;
}

.emerald-button[data-disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
  box-shadow: none;
}

.emerald-button[data-loading] {
  position: relative;
  cursor: progress;
  box-shadow: none;
}

.emerald-button__content {
  display: inline-flex;
  align-items: center;
  gap: inherit;
}

.emerald-button__content--hidden {
  visibility: hidden;
}

.emerald-button__loading {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
