<script setup lang="ts">
  import {
    EmTooltip,
    EmTooltipActivator,
    EmTooltipContent,
  } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-center">
    <EmTooltip interactive>
      <EmTooltipActivator>Deploy</EmTooltipActivator>

      <EmTooltipContent>
        Deploys the current build to production.
        <a class="emerald-docs-link" href="#" @click.prevent>Read the checklist</a>
      </EmTooltipContent>
    </EmTooltip>
  </div>
</template>

<style>
  .emerald-docs-center {
    display: flex;
    justify-content: center;
    padding: var(--emerald-spacing-xl, 32px) 0 var(--emerald-spacing-l, 24px);
  }

  .emerald-docs-link {
    color: var(--emerald-neutral-100, #fefefe);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
</style>
