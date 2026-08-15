<script lang="ts">
  // Framework
  import { Radio } from '@vuetify/v0'
  // Utilities
  import { useId } from '@vuetify/v0/utilities'

  export type EmRadioSize = 'sm' | 'md' | 'lg'

  export interface EmRadioProps {
    /** Value associated with this radio (required for group selection) */
    value: unknown
    disabled?: boolean
    size?: EmRadioSize
    /** Accessible name when no default-slot label is rendered */
    label?: string
    namespace?: string
    groupNamespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmRadio' })

  const {
    value,
    disabled = false,
    size = 'md',
    label,
    namespace,
    groupNamespace,
  } = defineProps<EmRadioProps>()

  // The label text lives in a sibling span, so the button root is named by reference —
  // a wrapping <label> does not name a <button>.
  const id = useId()
</script>

<template>
  <label class="emerald-radio" :data-disabled="disabled || undefined" :data-size="size">
    <Radio.Root
      :aria-labelledby="$slots.default ? id : undefined"
      class="emerald-radio__root"
      :disabled
      :group-namespace
      :label
      :namespace
      :value
    >
      <span aria-hidden="true" class="emerald-radio__circle" />

      <Radio.Indicator class="emerald-radio__indicator" :namespace>
        <span aria-hidden="true" class="emerald-radio__dot" />
      </Radio.Indicator>
    </Radio.Root>

    <span v-if="$slots.default" :id class="emerald-radio__label">
      <slot />
    </span>
  </label>
</template>

<style>
  .emerald-radio {
    display: inline-flex;
    align-items: center;
    gap: var(--emerald-spacing-2xs, 4px);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    color: var(--emerald-on-background, #2b2d2e);
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: var(--emerald-text-b1-weight, 400);
    line-height: var(--emerald-text-b1-height, 24px);
    cursor: pointer;
    user-select: none;
  }

  .emerald-radio[data-disabled] {
    cursor: not-allowed;
  }

  .emerald-radio__root {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: transparent;
    border: 0;
    padding: 0;
    margin: 0;
    outline: none;
    flex-shrink: 0;
    width: var(--emerald-control-checkbox-md, 20px);
    height: var(--emerald-control-checkbox-md, 20px);
  }

  .emerald-radio[data-size='sm'] .emerald-radio__root {
    width: var(--emerald-control-checkbox-sm, 16px);
    height: var(--emerald-control-checkbox-sm, 16px);
  }

  .emerald-radio[data-size='lg'] .emerald-radio__root {
    width: var(--emerald-control-checkbox-lg, 24px);
    height: var(--emerald-control-checkbox-lg, 24px);
  }

  .emerald-radio__circle {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-border, #aeb6be);
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-100, #fefefe);
    box-shadow: var(--emerald-shadow-field, 0 1px 2px 0 rgba(5, 0, 18, 0.05));
    transition:
      background-color var(--emerald-motion-duration-fast, 120ms) ease,
      border-color var(--emerald-motion-duration-fast, 120ms) ease,
      box-shadow var(--emerald-motion-duration-fast, 120ms) ease;
  }

  .emerald-radio:hover:not([data-disabled]) .emerald-radio__root[data-state='unchecked'] .emerald-radio__circle {
    background: var(--emerald-neutral-200, #f6f8fa);
    border-color: var(--emerald-neutral-600, #939dac);
  }

  .emerald-radio__root[data-state='checked'] .emerald-radio__circle {
    background: var(--emerald-primary-600, #1fae60);
    border-color: transparent;
    box-shadow: none;
  }

  .emerald-radio:hover:not([data-disabled]) .emerald-radio__root[data-state='checked'] .emerald-radio__circle {
    background: var(--emerald-primary-700, #027d4c);
  }

  .emerald-radio__root:focus-visible .emerald-radio__circle {
    outline: var(--emerald-stroke-s, 1px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: 0;
  }

  .emerald-radio__root[data-disabled] .emerald-radio__circle {
    background: var(--emerald-neutral-200, #f6f8fa);
    border-color: var(--emerald-neutral-300, #ccd6e7);
    box-shadow: none;
  }

  .emerald-radio__root[data-disabled][data-state='checked'] .emerald-radio__circle {
    background: var(--emerald-neutral-400, #aeb6be);
    border-color: transparent;
  }

  .emerald-radio__indicator {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
  }

  .emerald-radio__dot {
    display: block;
    width: 8px;
    height: 8px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-on-primary, #fefefe);
  }

  .emerald-radio[data-size='sm'] .emerald-radio__dot {
    width: 6px;
    height: 6px;
  }

  .emerald-radio[data-size='lg'] .emerald-radio__dot {
    width: 10px;
    height: 10px;
  }

  .emerald-radio__root[data-disabled] .emerald-radio__dot {
    background: var(--emerald-neutral-100, #fefefe);
  }

  .emerald-radio__label {
    color: inherit;
  }

  .emerald-radio[data-disabled] .emerald-radio__label {
    color: var(--emerald-neutral-400, #aeb6be);
  }
</style>
