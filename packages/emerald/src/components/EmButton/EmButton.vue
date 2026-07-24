<script lang="ts">
  // Framework
  import { Button } from '@vuetify/v0'

  export type EmButtonSize = 'sm' | 'md' | 'lg'
  export type EmButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive'

  export interface EmButtonProps {
    disabled?: boolean
    loading?: boolean
    size?: EmButtonSize
    variant?: EmButtonVariant
    /** Accessible label for icon-only buttons */
    ariaLabel?: string
    /** Form field name — renders a hidden input when set */
    name?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmButton' })

  const {
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ariaLabel,
    name,
  } = defineProps<EmButtonProps>()
</script>

<template>
  <Button.Root
    :aria-label
    class="emerald-button"
    :data-size="size"
    :data-variant="variant"
    :disabled
    :loading
    :name
  >
    <!--
      Button.Loading is a slot-only shell (no DOM node). Own the absolute
      positioning wrapper inside the slot — see v0 button/loading example.
    -->
    <Button.Loading>
      <span class="emerald-button__loading">
        <span aria-hidden="true" class="emerald-button__spinner" />
      </span>
    </Button.Loading>

    <Button.Content class="emerald-button__content">
      <slot />
    </Button.Content>
  </Button.Root>
</template>

<!-- Unscoped: Button.Root is multi-root; scoped data-v never lands on the <button>. -->
<style>
  .emerald-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    border: var(--emerald-stroke-s, 1px) solid transparent;
    border-radius: var(--emerald-radius-m, 8px);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
  }

  .emerald-button[data-size='sm'] {
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: var(--emerald-text-b3-height, 18px);
    font-weight: var(--emerald-text-b3-bold-weight, 600);
  }

  .emerald-button[data-size='md'] {
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 21px);
    font-weight: var(--emerald-text-b2-bold-weight, 600);
  }

  .emerald-button[data-size='lg'] {
    font-size: var(--emerald-text-b1-size, 16px);
    line-height: var(--emerald-text-b1-height, 24px);
    font-weight: var(--emerald-text-b1-bold-weight, 700);
  }

  .emerald-button[data-variant='primary'] {
    background: var(--emerald-primary-600, #1fae60);
    color: var(--emerald-on-primary, #fefefe);
  }

  .emerald-button[data-variant='primary']:hover:not([data-disabled]):not(:active) {
    background: var(--emerald-primary-700, #027d4c);
  }

  .emerald-button[data-variant='primary']:active:not([data-disabled]) {
    background: var(--emerald-primary-800, #01603a);
  }

  .emerald-button[data-variant='primary'][data-disabled] {
    background: var(--emerald-neutral-300, #ccd6e7);
  }

  .emerald-button[data-variant='primary']:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: 0;
  }

  .emerald-button[data-variant='secondary'] {
    background: transparent;
    border-color: var(--emerald-secondary-600, #00b4dc);
    color: var(--emerald-secondary-600, #00b4dc);
  }

  .emerald-button[data-variant='secondary']:hover:not([data-disabled]):not(:active) {
    border-color: var(--emerald-secondary-700, #00809d);
    color: var(--emerald-secondary-700, #00809d);
  }

  .emerald-button[data-variant='secondary']:active:not([data-disabled]) {
    border-color: var(--emerald-secondary-800, #006982);
    color: var(--emerald-secondary-800, #006982);
  }

  .emerald-button[data-variant='secondary'][data-disabled] {
    border-color: var(--emerald-neutral-400, #aeb6be);
    color: var(--emerald-neutral-400, #aeb6be);
  }

  .emerald-button[data-variant='secondary']:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-secondary-600, #00b4dc);
    outline-offset: 1px;
  }

  .emerald-button[data-variant='tertiary'] {
    background: transparent;
    color: var(--emerald-neutral-900, #494a4c);
  }

  .emerald-button[data-variant='tertiary']:hover:not([data-disabled]):not(:active) {
    background: var(--emerald-neutral-200, #ebf0f4);
  }

  .emerald-button[data-variant='tertiary']:active:not([data-disabled]) {
    background: var(--emerald-neutral-300, #ccd6e7);
  }

  .emerald-button[data-variant='tertiary'][data-disabled] {
    color: var(--emerald-neutral-400, #aeb6be);
  }

  .emerald-button[data-variant='tertiary']:focus-visible {
    background: var(--emerald-neutral-200, #ebf0f4);
    box-shadow: inset 0 0 0 var(--emerald-stroke-l, 4px) var(--emerald-neutral-600, #939dac);
    outline: none;
  }

  .emerald-button[data-variant='destructive'] {
    background: var(--emerald-danger-400, #df3543);
    color: var(--emerald-on-danger, #fefefe);
  }

  .emerald-button[data-variant='destructive']:hover:not([data-disabled]):not(:active) {
    background: var(--emerald-danger-500, #c61424);
  }

  .emerald-button[data-variant='destructive']:active:not([data-disabled]) {
    background: var(--emerald-danger-600, #a1000e);
  }

  .emerald-button[data-variant='destructive'][data-disabled] {
    background: var(--emerald-neutral-300, #ccd6e7);
  }

  .emerald-button[data-variant='destructive']:focus-visible {
    outline: var(--emerald-stroke-m, 2px) solid var(--emerald-danger-400, #df3543);
    outline-offset: 0;
  }

  .emerald-button[data-disabled] {
    cursor: not-allowed;
    pointer-events: none;
  }

  .emerald-button[data-loading] {
    cursor: progress;
  }

  .emerald-button__content {
    display: inline-flex;
    align-items: center;
    gap: inherit;
  }

  .emerald-button__loading {
    position: absolute;
    inset: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .emerald-button__spinner {
    width: 1em;
    height: 1em;
    border: 2px solid currentcolor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: emerald-button-spin 0.6s linear infinite;
  }

  @keyframes emerald-button-spin {
    to { transform: rotate(360deg); }
  }
</style>
