<script lang="ts">
  // Framework
  import { Step } from '@vuetify/v0'

  // Types
  import type { StepItemProps } from '@vuetify/v0'

  export interface EmStepItemProps extends StepItemProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmStepItem' })

  const {
    id,
    label,
    value,
    disabled = false,
    namespace,
  } = defineProps<EmStepItemProps>()
</script>

<template>
  <!-- Step.Item is renderless — bind slot attrs onto the host control -->
  <Step.Item
    :id
    v-slot="{ attrs, label: itemLabel }"
    :disabled
    :label
    :namespace
    :value
  >
    <button
      class="emerald-step__item"
      type="button"
      v-bind="attrs"
    >
      <span aria-hidden="true" class="emerald-step__marker" />

      <span class="emerald-step__label">
        <slot>{{ itemLabel }}</slot>
      </span>
    </button>
  </Step.Item>
</template>

<style>
  .emerald-step__item {
    display: inline-flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    margin: 0;
    padding: 0;
    background: transparent;
    border: 0;
    color: var(--emerald-neutral-700, #757e85);
    font: inherit;
    text-align: start;
    cursor: pointer;
    counter-increment: emerald-step;
  }

  .emerald-step__marker {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 28px;
    height: 28px;
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-neutral-200, #f6f8fa);
    color: var(--emerald-neutral-800, #636a70);
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: var(--emerald-text-b2-bold-weight, 600);
    line-height: 1;
    transition:
      background-color var(--emerald-motion-duration-fast, 120ms) ease,
      border-color var(--emerald-motion-duration-fast, 120ms) ease,
      color var(--emerald-motion-duration-fast, 120ms) ease;
  }

  .emerald-step__marker::before {
    content: counter(emerald-step);
  }

  .emerald-step__label {
    font-weight: var(--emerald-text-b2-weight, 400);
  }

  .emerald-step__item[data-selected] {
    color: var(--emerald-primary-700, #027d4c);
  }

  .emerald-step__item[data-selected] .emerald-step__marker {
    background: var(--emerald-primary-600, #1fae60);
    border-color: var(--emerald-primary-600, #1fae60);
    color: var(--emerald-neutral-100, #fefefe);
  }

  .emerald-step__item[data-selected] .emerald-step__label {
    font-weight: var(--emerald-text-b2-bold-weight, 600);
  }

  .emerald-step__item:hover:not([data-disabled]):not([data-selected]) .emerald-step__marker {
    border-color: var(--emerald-primary-500, #6fb38c);
    background: var(--emerald-primary-100, #e7fff2);
  }

  .emerald-step__item:focus-visible {
    outline: none;
  }

  .emerald-step__item:focus-visible .emerald-step__marker {
    box-shadow: var(--emerald-shadow-focus, 0 0 0 5px rgba(38, 194, 109, 0.2));
  }

  .emerald-step__item[data-disabled] {
    color: var(--emerald-neutral-400, #aeb6be);
    cursor: not-allowed;
  }

  .emerald-step__item[data-disabled] .emerald-step__marker {
    background: var(--emerald-neutral-200, #f6f8fa);
    border-color: var(--emerald-neutral-300, #ccd6e7);
    color: var(--emerald-neutral-400, #aeb6be);
  }
</style>
