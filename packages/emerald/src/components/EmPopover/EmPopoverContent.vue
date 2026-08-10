<script lang="ts">
  // Framework
  import { Popover, usePopoverContext } from '@vuetify/v0'

  // Types
  import type { PopoverContentProps } from '@vuetify/v0'

  export interface EmPopoverContentProps extends Pick<
    PopoverContentProps,
    'positionArea' | 'positionTry'
  > {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPopoverContent' })

  const { positionArea, positionTry } = defineProps<EmPopoverContentProps>()

  // Popover.Content only honours position-area/position-try when it is given an
  // explicit id; the root's id keeps the anchor-name matched to the activator.
  const context = usePopoverContext()
</script>

<template>
  <Popover.Content
    :id="context.id"
    class="emerald-popover"
    :position-area
    :position-try
  >
    <slot />
  </Popover.Content>
</template>

<style>
  .emerald-popover {
    box-sizing: border-box;
    flex-direction: column;
    align-items: stretch;
    padding: var(--emerald-spacing-xs, 8px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-alpha-gray-20, #ccd6e733);
    border-radius: var(--emerald-radius-m, 8px);
    background: var(--emerald-surface, #fff);
    box-shadow: var(--emerald-shadow-m, 0 2px 4px 0 rgba(51, 51, 51, 0.2));
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: var(--emerald-text-b1-weight, 400);
    line-height: var(--emerald-text-b1-height, 24px);
    color: var(--emerald-on-surface, #2b2d2e);
    opacity: 0;
    transform: translateY(-4px);
    transition-property: opacity, transform, overlay, display;
    transition-duration: var(--emerald-motion-duration-base, 180ms);
    transition-timing-function: var(--emerald-motion-ease-standard, cubic-bezier(0.4, 0, 0.2, 1));
    transition-behavior: allow-discrete;
  }

  .emerald-popover:popover-open {
    display: flex;
    opacity: 1;
    transform: translateY(0);
  }

  @starting-style {
    .emerald-popover:popover-open {
      opacity: 0;
      transform: translateY(-4px);
    }
  }
</style>
