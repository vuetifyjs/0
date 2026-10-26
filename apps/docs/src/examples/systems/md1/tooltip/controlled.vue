<script setup lang="ts">
  import { Md1Button, Md1Tooltip } from '@paper/md1'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <div class="md1-docs-row">
    <Md1Tooltip v-model="open">
      <Md1Tooltip.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" aria-label="Filter" icon="filter-list" />
      </Md1Tooltip.Activator>

      <Md1Tooltip.Content>Filter list</Md1Tooltip.Content>
    </Md1Tooltip>

    <Md1Button @click="open = !open">
      <span class="md1-docs-tooltip-swap">
        <span :data-hidden="open || undefined">Show hint</span>

        <span :data-hidden="!open || undefined">Hide hint</span>
      </span>
    </Md1Button>
  </div>
</template>

<style>
  /* Both labels share one grid cell, so the button keeps the wider label's width whichever one shows. */
  .md1-docs-tooltip-swap {
    display: inline-grid;
  }

  .md1-docs-tooltip-swap > * {
    grid-area: 1 / 1;
  }

  .md1-docs-tooltip-swap > [data-hidden] {
    visibility: hidden;
  }
</style>
