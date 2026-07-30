<script lang="ts">
  // Framework
  import { Select } from '@vuetify/v0'

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

    <!--
      Named slot so consumers can swap the chevron for a brand icon.
      Default is decorative (aria-hidden); custom icons should set a11y as needed.
    -->
    <span class="emerald-select__icon">
      <slot name="icon">
        <svg
          aria-hidden="true"
          fill="none"
          height="16"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          viewBox="0 0 16 16"
          width="16"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </slot>
    </span>
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
    transition: transform var(--emerald-motion-duration-base, 180ms) var(--emerald-motion-ease-standard, cubic-bezier(0.4, 0, 0.2, 1));
    color: var(--emerald-neutral-700, #757e85);
  }

  .emerald-select[data-disabled] .emerald-select__activator,
  .emerald-select__activator:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
