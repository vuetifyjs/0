<script lang="ts">
  // Framework
  import { Tooltip } from '@vuetify/v0'

  export interface EmTooltipContentProps {
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltipContent' })

  const { namespace } = defineProps<EmTooltipContentProps>()
</script>

<template>
  <Tooltip.Content class="emerald-tooltip__content" :namespace>
    <slot />
  </Tooltip.Content>
</template>

<style>
  .emerald-tooltip__content {
    box-sizing: border-box;
    max-width: 240px;
    padding: var(--emerald-spacing-2xs, 4px) var(--emerald-spacing-xs, 8px);
    border: 0;
    border-radius: var(--emerald-radius-s, 6px);
    background: var(--emerald-neutral-1000, #2b2d2e);
    color: var(--emerald-neutral-100, #fefefe);
    box-shadow: var(--emerald-shadow-m, 0 2px 4px 0 rgba(51, 51, 51, 0.2));
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: var(--emerald-text-b3-weight, 400);
    line-height: var(--emerald-text-b3-height, 18px);
    margin: var(--emerald-spacing-2xs, 4px) 0;
  }
</style>
