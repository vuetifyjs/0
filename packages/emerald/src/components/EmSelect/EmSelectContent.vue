<script lang="ts">
  // Framework
  import { Select } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelectContent' })
</script>

<template>
  <Select.Content class="emerald-select__content">
    <slot />
  </Select.Content>
</template>

<style>
  .emerald-select__content {
    flex-direction: column;
    align-items: stretch;
    min-width: anchor-size(width);
    padding: var(--emerald-spacing-xs, 8px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-alpha-gray-20, #ccd6e733);
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-surface, #fff);
    box-shadow: var(--emerald-shadow-m, 0 2px 4px 0 rgba(51, 51, 51, 0.2));
    margin-top: var(--emerald-spacing-2xs, 4px);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: var(--emerald-text-b1-weight, 400);
    line-height: var(--emerald-text-b1-height, 24px);
    opacity: 0;
    transform: translateY(-4px);
    transition-property: opacity, transform, overlay, display;
    transition-duration: 180ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-behavior: allow-discrete;
  }

  .emerald-select__content:popover-open {
    display: flex;
    opacity: 1;
    transform: translateY(0);
  }

  @starting-style {
    .emerald-select__content:popover-open {
      opacity: 0;
      transform: translateY(-4px);
    }
  }
</style>
