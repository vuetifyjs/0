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

    <Md1Button @click="open = !open">{{ open ? 'Hide hint' : 'Show hint' }}</Md1Button>
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }
</style>
