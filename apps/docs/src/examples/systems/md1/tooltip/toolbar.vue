<script setup lang="ts">
  import { Md1Button, Md1Tooltip } from '@paper/md1'

  const actions = [
    { icon: 'edit', label: 'Edit' },
    { icon: 'share', label: 'Share' },
    { icon: 'bookmark', label: 'Bookmark' },
    { icon: 'delete', label: 'Delete' },
    { icon: 'more-vert', label: 'More options' },
  ] as const
</script>

<template>
  <div class="md1-docs-row">
    <Md1Tooltip v-for="action in actions" :key="action.icon">
      <Md1Tooltip.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" :aria-label="action.label" :icon="action.icon" />
      </Md1Tooltip.Activator>

      <Md1Tooltip.Content>{{ action.label }}</Md1Tooltip.Content>
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
