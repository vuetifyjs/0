<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  export type EmTagVariant = 'neutral' | 'success' | 'danger' | 'info'

  export interface EmTagProps {
    variant?: EmTagVariant
    selected?: boolean
    disabled?: boolean
    /** Render as button when interactive */
    interactive?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTag' })

  const {
    variant = 'neutral',
    selected = false,
    disabled = false,
    interactive = false,
  } = defineProps<EmTagProps>()
</script>

<template>
  <Atom
    :aria-pressed="interactive ? selected : undefined"
    :as="interactive ? 'button' : 'span'"
    class="emerald-tag"
    :data-disabled="disabled || undefined"
    :data-selected="selected || undefined"
    :data-variant="variant"
    :disabled="interactive ? disabled : undefined"
    :type="interactive ? 'button' : undefined"
  >
    <slot />
  </Atom>
</template>

<style>
  .emerald-tag {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--emerald-spacing-3xs, 2px);
    min-height: var(--emerald-text-b3-height, 18px);
    padding: 1px var(--emerald-spacing-2xs, 4px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-border, #aeb6be);
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-background, #fefefe);
    color: var(--emerald-on-surface, #2b2d2e);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: var(--emerald-text-b3-weight, 400);
    line-height: var(--emerald-text-b3-height, 18px);
    white-space: nowrap;
  }

  button.emerald-tag {
    cursor: pointer;
    user-select: none;
  }

  button.emerald-tag:focus-visible {
    outline: none;
    box-shadow: var(--emerald-shadow-focus, 0 0 0 5px rgba(38, 194, 109, 0.2));
  }

  .emerald-tag:hover:not([data-disabled]) {
    box-shadow: var(--emerald-shadow-m, 0 2px 4px 0 rgba(51, 51, 51, 0.2));
  }

  .emerald-tag[data-variant='neutral'][data-selected] {
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .emerald-tag[data-variant='success'] {
    border-color: var(--emerald-success-200, #97d4b4);
  }

  .emerald-tag[data-variant='success'][data-selected] {
    background: var(--emerald-primary-100, #e7fff2);
    border-color: var(--emerald-primary-300, #baedd0);
  }

  .emerald-tag[data-variant='danger'] {
    border-color: var(--emerald-danger-200, #ffccd2);
  }

  .emerald-tag[data-variant='danger'][data-selected] {
    background: var(--emerald-danger-100, #ffebee);
  }

  .emerald-tag[data-variant='info'] {
    border-color: var(--emerald-info-300, #93c8ff);
  }

  .emerald-tag[data-variant='info'][data-selected] {
    background: var(--emerald-info-100, #e4f2ff);
  }

  .emerald-tag[data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
</style>
