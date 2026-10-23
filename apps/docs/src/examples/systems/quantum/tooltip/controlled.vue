<script setup lang="ts">
  import { QuButton, QuTooltip } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <div class="quantum-docs-row">
    <QuTooltip v-model="open">
      <QuTooltip.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" aria-label="Filter" icon="filter-list" />
      </QuTooltip.Activator>

      <QuTooltip.Content>Filter list</QuTooltip.Content>
    </QuTooltip>

    <QuButton @click="open = !open">{{ open ? 'Hide hint' : 'Show hint' }}</QuButton>
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
