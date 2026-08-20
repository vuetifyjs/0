<script setup lang="ts">
  import {
    EmButton,
    EmIcon,
    EmTooltip,
    EmTooltipActivator,
    EmTooltipContent,
  } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-center">
    <EmTooltip>
      <!-- attrs carry the wiring; styles carry the anchor-name — bind both -->
      <EmTooltipActivator v-slot="{ attrs, styles }" renderless>
        <EmButton v-bind="attrs" aria-label="Help" :style="styles" variant="secondary">
          <EmIcon name="help" size="s" />
        </EmButton>
      </EmTooltipActivator>

      <EmTooltipContent>Opens the keyboard shortcut reference</EmTooltipContent>
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
