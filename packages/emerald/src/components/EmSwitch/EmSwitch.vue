<script lang="ts">
  // Framework
  import { Switch } from '@vuetify/v0'

  export type EmSwitchSize = 'sm' | 'md' | 'lg'

  export interface EmSwitchProps {
    disabled?: boolean
    size?: EmSwitchSize
    name?: string
    value?: unknown
    /** Accessible name when no default-slot label is rendered */
    label?: string
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSwitch' })

  const {
    disabled = false,
    size = 'md',
    name,
    value,
    label,
    namespace,
  } = defineProps<EmSwitchProps>()

  const model = defineModel<boolean>()
</script>

<template>
  <label class="emerald-switch" :data-disabled="disabled || undefined" :data-size="size">
    <Switch.Root
      v-model="model"
      class="emerald-switch__root"
      :disabled
      :label
      :name
      :namespace
      :value
    >
      <Switch.Track class="emerald-switch__track" :namespace>
        <Switch.Thumb class="emerald-switch__thumb" :namespace />
      </Switch.Track>
    </Switch.Root>

    <span v-if="$slots.default" class="emerald-switch__label">
      <slot />
    </span>
  </label>
</template>

<style>
  .emerald-switch {
    display: inline-flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    color: var(--emerald-on-background, #2b2d2e);
    cursor: pointer;
    user-select: none;
  }

  .emerald-switch[data-disabled] {
    cursor: not-allowed;
  }

  .emerald-switch__root {
    display: inline-flex;
    align-items: center;
    position: relative;
    background: transparent;
    border: 0;
    padding: 0;
    margin: 0;
    outline: none;
    flex-shrink: 0;
    font: inherit;
    color: inherit;
    cursor: inherit;
  }

  .emerald-switch__label {
    font-size: var(--emerald-text-b1-size, 16px);
    line-height: var(--emerald-text-b1-height, 24px);
    font-weight: var(--emerald-text-b1-bold-weight, 700);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-switch__root:focus-visible::after {
    content: '';
    position: absolute;
    inset: -1px -2px;
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-primary-600, #1fae60);
    border-radius: var(--emerald-radius-full, 999px);
    pointer-events: none;
  }

  .emerald-switch__track {
    display: inline-flex;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    width: var(--emerald-control-switch-track-width-md, 36px);
    height: var(--emerald-control-switch-track-height-md, 20px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-400, #aeb6be);
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-200, #ebf0f4);
    box-shadow: var(--emerald-shadow-field, 0 1px 2px 0 rgba(5, 0, 18, 0.05));
    transition: background-color var(--emerald-motion-duration-fast, 120ms) ease, border-color var(--emerald-motion-duration-fast, 120ms) ease, box-shadow var(--emerald-motion-duration-fast, 120ms) ease;
    overflow: visible;
  }

  .emerald-switch[data-size='sm'] .emerald-switch__track {
    width: var(--emerald-control-switch-track-width-sm, 28px);
    height: var(--emerald-control-switch-track-height-sm, 16px);
  }

  .emerald-switch[data-size='lg'] .emerald-switch__track {
    width: var(--emerald-control-switch-track-width-lg, 44px);
    height: var(--emerald-control-switch-track-height-lg, 24px);
  }

  .emerald-switch__track[data-state='checked'] {
    background: var(--emerald-primary-600, #1fae60);
    border-color: var(--emerald-primary-600, #1fae60);
    box-shadow: none;
  }

  .emerald-switch:not([data-disabled]):hover .emerald-switch__track[data-state='unchecked'] {
    background: var(--emerald-neutral-400, #aeb6be);
    border-color: var(--emerald-neutral-600, #939dac);
  }

  .emerald-switch:not([data-disabled]):hover .emerald-switch__track[data-state='checked'] {
    background: var(--emerald-primary-700, #027d4c);
    border-color: var(--emerald-primary-700, #027d4c);
  }

  .emerald-switch[data-disabled] .emerald-switch__track[data-state='unchecked'] {
    opacity: 0.8;
  }

  .emerald-switch[data-disabled] .emerald-switch__track[data-state='checked'] {
    background: var(--emerald-neutral-400, #aeb6be);
    border-color: var(--emerald-neutral-600, #939dac);
    opacity: 0.5;
  }

  .emerald-switch__thumb {
    --travel: var(--emerald-control-switch-travel-md, 8px);
    --sign: -1;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--emerald-control-switch-thumb-md, 16px);
    height: var(--emerald-control-switch-thumb-md, 16px);
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-100, #fefefe);
    transform: translate(calc(-50% + var(--sign) * var(--travel)), -50%);
    transition: transform var(--emerald-motion-duration-fast, 120ms) ease;
    pointer-events: none;
    box-shadow: var(--emerald-shadow-thumb, 0 1px 3px 0 rgba(5, 0, 18, 0.12));
  }

  .emerald-switch__thumb[data-state='checked'] {
    --sign: 1;
  }

  /* Track forces dir=ltr in v0 — do not reverse travel under [dir=rtl]. */

  .emerald-switch[data-size='sm'] .emerald-switch__thumb {
    --travel: var(--emerald-control-switch-travel-sm, 6px);
    width: var(--emerald-control-switch-thumb-sm, 12px);
    height: var(--emerald-control-switch-thumb-sm, 12px);
  }

  .emerald-switch[data-size='lg'] .emerald-switch__thumb {
    --travel: var(--emerald-control-switch-travel-lg, 10px);
    width: var(--emerald-control-switch-thumb-lg, 20px);
    height: var(--emerald-control-switch-thumb-lg, 20px);
  }

  .emerald-switch[data-disabled] .emerald-switch__label {
    color: var(--emerald-neutral-400, #aeb6be);
  }
</style>
