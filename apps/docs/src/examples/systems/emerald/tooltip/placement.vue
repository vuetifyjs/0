<script setup lang="ts">
  import {
    EmTooltip,
    EmTooltipActivator,
    EmTooltipContent,
  } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmTooltip>
      <EmTooltipActivator>Top</EmTooltipActivator>

      <EmTooltipContent>The default — above the trigger</EmTooltipContent>
    </EmTooltip>

    <EmTooltip position-area="bottom" position-try="most-height bottom">
      <EmTooltipActivator>Bottom</EmTooltipActivator>

      <EmTooltipContent>Below the trigger</EmTooltipContent>
    </EmTooltip>

    <EmTooltip position-area="inline-end">
      <EmTooltipActivator>Inline end</EmTooltipActivator>

      <EmTooltipContent>Follows the writing direction</EmTooltipContent>
    </EmTooltip>
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-xl, 32px) 0;
  }
</style>
