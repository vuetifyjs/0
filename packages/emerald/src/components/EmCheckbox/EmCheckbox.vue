<script lang="ts">
  // Framework
  import { Checkbox } from '@vuetify/v0'

  export type EmCheckboxSize = 'sm' | 'md' | 'lg'

  export interface EmCheckboxProps {
    disabled?: boolean
    indeterminate?: boolean
    size?: EmCheckboxSize
    name?: string
    value?: unknown
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCheckbox' })

  const {
    disabled = false,
    indeterminate = false,
    size = 'md',
    name,
    value,
  } = defineProps<EmCheckboxProps>()

  const model = defineModel<boolean>()
</script>

<template>
  <label class="emerald-checkbox" :data-disabled="disabled || undefined" :data-size="size">
    <Checkbox.Root
      v-model="model"
      class="emerald-checkbox__root"
      :disabled
      :indeterminate
      :name
      :value
    >
      <span aria-hidden="true" class="emerald-checkbox__box" />

      <Checkbox.Indicator v-slot="{ isMixed }" class="emerald-checkbox__indicator">
        <svg
          v-if="isMixed"
          class="emerald-checkbox__glyph"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-width="2.5"
          viewBox="0 0 16 16"
        >
          <path d="M3.5 8h9" />
        </svg>

        <svg
          v-else
          class="emerald-checkbox__glyph"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2.5"
          viewBox="0 0 16 16"
        >
          <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
        </svg>
      </Checkbox.Indicator>
    </Checkbox.Root>

    <span v-if="$slots.default" class="emerald-checkbox__label">
      <slot />
    </span>
  </label>
</template>

<style>
  .emerald-checkbox {
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

  .emerald-checkbox[data-disabled] {
    cursor: not-allowed;
  }

  .emerald-checkbox__root {
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
    width: 20px;
    height: 20px;
  }

  .emerald-checkbox[data-size='sm'] .emerald-checkbox__root {
    width: 16px;
    height: 16px;
  }

  .emerald-checkbox[data-size='lg'] .emerald-checkbox__root {
    width: 24px;
    height: 24px;
  }

  .emerald-checkbox__box {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-border, #aeb6be);
    border-radius: var(--emerald-radius-xs, 4px);
    background: var(--emerald-neutral-100, #fefefe);
    box-shadow: var(--emerald-shadow-field, 0 1px 2px 0 rgba(5, 0, 18, 0.05));
    transition: background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
  }

  .emerald-checkbox:hover:not([data-disabled]) .emerald-checkbox__root[data-state='unchecked'] .emerald-checkbox__box {
    background: var(--emerald-neutral-200, #ebf0f4);
    border-color: var(--emerald-neutral-600, #939dac);
  }

  .emerald-checkbox__root[data-state='checked'] .emerald-checkbox__box,
  .emerald-checkbox__root[data-state='indeterminate'] .emerald-checkbox__box {
    background: var(--emerald-primary-600, #1fae60);
    border-color: transparent;
    box-shadow: none;
  }

  .emerald-checkbox:hover:not([data-disabled]) .emerald-checkbox__root[data-state='checked'] .emerald-checkbox__box,
  .emerald-checkbox:hover:not([data-disabled]) .emerald-checkbox__root[data-state='indeterminate'] .emerald-checkbox__box {
    background: var(--emerald-primary-700, #027d4c);
  }

  .emerald-checkbox__root:focus-visible .emerald-checkbox__box {
    outline: var(--emerald-stroke-s, 1px) solid var(--emerald-primary-600, #1fae60);
    outline-offset: 0;
  }

  .emerald-checkbox__root[data-disabled] .emerald-checkbox__box {
    background: var(--emerald-neutral-200, #ebf0f4);
    border-color: var(--emerald-neutral-300, #ccd6e7);
    box-shadow: none;
  }

  .emerald-checkbox__indicator {
    position: relative;
    z-index: 1;
    display: inline-flex;
    color: var(--emerald-on-primary, #fefefe);
    line-height: 0;
  }

  .emerald-checkbox__glyph {
    width: 16px;
    height: 16px;
  }

  .emerald-checkbox[data-size='sm'] .emerald-checkbox__glyph {
    width: 12px;
    height: 12px;
  }

  .emerald-checkbox[data-size='lg'] .emerald-checkbox__glyph {
    width: 18px;
    height: 18px;
  }

  .emerald-checkbox__label {
    color: inherit;
  }
</style>
