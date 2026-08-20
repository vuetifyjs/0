<script lang="ts">
  // Framework
  import { Checkbox } from '@vuetify/v0'
  import { useId } from '@vuetify/v0/utilities'

  // Utilities
  import { toValue } from 'vue'

  // Types
  import type { CheckboxRootProps } from '@vuetify/v0'

  // Components
  import EmIcon from '../EmIcon/EmIcon.vue'

  export type EmCheckboxSize = 'sm' | 'md' | 'lg'

  export interface EmCheckboxProps extends Pick<
    CheckboxRootProps,
    'disabled' | 'indeterminate' | 'name' | 'value' | 'label' | 'namespace'
  > {
    size?: EmCheckboxSize
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
    label,
    namespace,
  } = defineProps<EmCheckboxProps>()

  const model = defineModel<boolean>()
  // The label text lives in a sibling span, so the button root is named by reference —
  // a wrapping <label> does not name a <button>.
  const id = useId()
</script>

<template>
  <label class="emerald-checkbox" :data-disabled="toValue(disabled) || undefined" :data-size="size">
    <Checkbox.Root
      v-model="model"
      :aria-labelledby="$slots.default ? id : undefined"
      class="emerald-checkbox__root"
      :disabled
      :indeterminate
      :label
      :name
      :namespace
      :value
    >
      <span aria-hidden="true" class="emerald-checkbox__box" />

      <Checkbox.Indicator v-slot="{ isMixed }" class="emerald-checkbox__indicator" :namespace>
        <EmIcon class="emerald-checkbox__glyph" :name="isMixed ? 'minus' : 'check'" />
      </Checkbox.Indicator>
    </Checkbox.Root>

    <span v-if="$slots.default" :id class="emerald-checkbox__label">
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
    width: var(--emerald-control-checkbox-md, 20px);
    height: var(--emerald-control-checkbox-md, 20px);
  }

  .emerald-checkbox[data-size='sm'] .emerald-checkbox__root {
    width: var(--emerald-control-checkbox-sm, 16px);
    height: var(--emerald-control-checkbox-sm, 16px);
  }

  .emerald-checkbox[data-size='lg'] .emerald-checkbox__root {
    width: var(--emerald-control-checkbox-lg, 24px);
    height: var(--emerald-control-checkbox-lg, 24px);
  }

  .emerald-checkbox__box {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-border, #aeb6be);
    border-radius: var(--emerald-radius-xs, 4px);
    background: var(--emerald-neutral-100, #fefefe);
    box-shadow: var(--emerald-shadow-field, 0 1px 2px 0 rgba(5, 0, 18, 0.05));
    transition: background-color var(--emerald-motion-duration-fast, 120ms) ease, border-color var(--emerald-motion-duration-fast, 120ms) ease, box-shadow var(--emerald-motion-duration-fast, 120ms) ease;
  }

  .emerald-checkbox:hover:not([data-disabled]) .emerald-checkbox__root[data-state='unchecked'] .emerald-checkbox__box {
    background: var(--emerald-neutral-200, #f6f8fa);
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
    background: var(--emerald-neutral-200, #f6f8fa);
    border-color: var(--emerald-neutral-300, #ccd6e7);
    box-shadow: none;
  }

  .emerald-checkbox__root[data-disabled][data-state='checked'] .emerald-checkbox__box,
  .emerald-checkbox__root[data-disabled][data-state='indeterminate'] .emerald-checkbox__box {
    background: var(--emerald-neutral-400, #aeb6be);
    border-color: transparent;
  }

  .emerald-checkbox__indicator {
    position: relative;
    z-index: 1;
    display: inline-flex;
    color: var(--emerald-on-primary, #fefefe);
    line-height: 0;
  }

  .emerald-checkbox__root[data-disabled] .emerald-checkbox__indicator {
    color: var(--emerald-neutral-100, #fefefe);
  }

  .emerald-checkbox__glyph {
    /* The mark scales with the box, which follows the control geometry rather
       than the icon scale. Stroke is 2.5 against a 16-unit grid, restated for
       the icon set's 24-unit one so the mark keeps its weight. */
    --emerald-icon-size: 16px;
    --emerald-icon-stroke: 3.75;
  }

  .emerald-checkbox[data-size='sm'] .emerald-checkbox__glyph {
    --emerald-icon-size: 12px;
  }

  .emerald-checkbox[data-size='lg'] .emerald-checkbox__glyph {
    --emerald-icon-size: 18px;
  }

  .emerald-checkbox__label {
    color: inherit;
  }

  .emerald-checkbox[data-disabled] .emerald-checkbox__label {
    color: var(--emerald-neutral-400, #aeb6be);
  }
</style>
