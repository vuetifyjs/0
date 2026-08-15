<script lang="ts">
  // Framework
  import { Select } from '@vuetify/v0'

  // Components
  import EmIcon from '../EmIcon/EmIcon.vue'

  export interface EmSelectActivatorProps {
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelectActivator' })

  const { namespace } = defineProps<EmSelectActivatorProps>()
</script>

<template>
  <Select.Activator class="emerald-select__activator" :namespace>
    <slot />

    <!-- The caret belongs to the control, not the consumer: the open-state
         rotation below has no target unless the activator draws it. -->
    <EmIcon class="emerald-select__icon" name="chevron-down" />
  </Select.Activator>
</template>

<style>
  .emerald-select__activator {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-m, 16px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-border, #aeb6be);
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-neutral-100, #fefefe);
    font-family: inherit;
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: var(--emerald-text-b1-weight, 400);
    line-height: var(--emerald-text-b1-height, 24px);
    color: var(--emerald-on-surface, #2b2d2e);
    cursor: pointer;
    transition:
      border-color var(--emerald-motion-duration-fast, 120ms) ease,
      box-shadow var(--emerald-motion-duration-fast, 120ms) ease;
  }

  .emerald-select__activator:hover:not(:disabled):not([data-open]) {
    border-color: var(--emerald-neutral-600, #939dac);
  }

  .emerald-select__activator:focus-visible,
  .emerald-select__activator[data-open] {
    outline: none;
    border-color: var(--emerald-primary-600, #1fae60);
    box-shadow: var(--emerald-shadow-focus-s, 0 0 0 2px rgba(38, 194, 109, 0.2));
  }

  .emerald-select__activator[data-open] .emerald-select__icon {
    transform: rotate(180deg);
  }

  .emerald-select__icon {
    flex: none;
    /* Matches the 16px caret the showcase drew by hand; the token steps bracket
       it at 18px and 20px, both of which crowd the field's 8px padding. */
    --emerald-icon-size: 16px;
    --emerald-icon-stroke: 2;
    transition: transform var(--emerald-motion-duration-base, 180ms) var(--emerald-motion-ease-standard, cubic-bezier(0.4, 0, 0.2, 1));
    color: var(--emerald-neutral-700, #757e85);
  }

  .emerald-select[data-disabled] .emerald-select__activator,
  .emerald-select__activator:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
