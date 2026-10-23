<script setup lang="ts">
  import { QuButton, QuTooltip } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuTooltip>
      <QuTooltip.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" aria-label="Delete" icon="delete" />
      </QuTooltip.Activator>

      <QuTooltip.Content>Delete</QuTooltip.Content>
    </QuTooltip>
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }
</style>
