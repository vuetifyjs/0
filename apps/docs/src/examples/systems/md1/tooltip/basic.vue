<script setup lang="ts">
  import { Md1Button, Md1Tooltip } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1Tooltip>
      <Md1Tooltip.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" aria-label="Delete" icon="delete" />
      </Md1Tooltip.Activator>

      <Md1Tooltip.Content>Delete</Md1Tooltip.Content>
    </Md1Tooltip>
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
