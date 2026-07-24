<script lang="ts">
  // Framework
  import { Switch } from '@vuetify/v0'

  export type EmSwitchSize = 'sm' | 'md' | 'lg'

  export interface EmSwitchProps {
    disabled?: boolean
    size?: EmSwitchSize
    name?: string
    value?: unknown
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSwitch' })

  const {
    disabled = false,
    size = 'md',
    name,
    value,
  } = defineProps<EmSwitchProps>()

  const model = defineModel<boolean>()
</script>

<template>
  <label class="emerald-switch" :data-disabled="disabled || undefined" :data-size="size">
    <Switch.Root
      v-model="model"
      class="emerald-switch__root"
      :disabled
      :name
      :value
    >
      <Switch.Track class="emerald-switch__track">
        <Switch.Thumb class="emerald-switch__thumb" />
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
    border: 1px solid var(--emerald-primary-600, #1fae60);
    border-radius: var(--emerald-radius-full, 999px);
    pointer-events: none;
  }

  .emerald-switch__track {
    display: inline-flex;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    width: 36px;
    height: 20px;
    border: 1px solid var(--emerald-neutral-400, #aeb6be);
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-200, #ebf0f4);
    box-shadow: var(--emerald-shadow-field, 0 1px 2px 0 rgba(5, 0, 18, 0.05));
    transition: background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
    overflow: visible;
  }

  .emerald-switch[data-size='sm'] .emerald-switch__track {
    width: 28px;
    height: 16px;
  }

  .emerald-switch[data-size='lg'] .emerald-switch__track {
    width: 44px;
    height: 24px;
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
    --travel: 8px;
    --sign: -1;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-100, #fefefe);
    transform: translate(calc(-50% + var(--sign) * var(--travel)), -50%);
    transition: transform 120ms ease;
    pointer-events: none;
    box-shadow: var(--emerald-shadow-thumb, 0 1px 3px 0 rgba(5, 0, 18, 0.12));
  }

  .emerald-switch__thumb[data-state='checked'] {
    --sign: 1;
  }

  [dir='rtl'] .emerald-switch__thumb {
    --sign: 1;
  }

  [dir='rtl'] .emerald-switch__thumb[data-state='checked'] {
    --sign: -1;
  }

  .emerald-switch[data-size='sm'] .emerald-switch__thumb {
    --travel: 6px;
    width: 12px;
    height: 12px;
  }

  .emerald-switch[data-size='lg'] .emerald-switch__thumb {
    --travel: 10px;
    width: 20px;
    height: 20px;
  }
</style>
