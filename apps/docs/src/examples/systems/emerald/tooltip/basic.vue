<script setup lang="ts">
  import {
    EmTooltip,
    EmTooltipActivator,
    EmTooltipContent,
  } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-center">
    <EmTooltip>
      <EmTooltipActivator>Save draft</EmTooltipActivator>

      <EmTooltipContent>Saves your changes without publishing them</EmTooltipContent>
    </EmTooltip>
  </div>
</template>

<style>
  .emerald-docs-center {
    display: flex;
    justify-content: center;
    padding: var(--emerald-spacing-xl, 32px) 0 var(--emerald-spacing-l, 24px);
  }
</style>
