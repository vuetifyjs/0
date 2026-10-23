<script setup lang="ts">
  import { QuButton, QuTooltip } from '@paper/quantum'

  const actions = [
    { icon: 'edit', label: 'Edit' },
    { icon: 'share', label: 'Share' },
    { icon: 'bookmark', label: 'Bookmark' },
    { icon: 'delete', label: 'Delete' },
    { icon: 'more-vert', label: 'More options' },
  ] as const
</script>

<template>
  <div class="quantum-docs-row">
    <QuTooltip v-for="action in actions" :key="action.icon">
      <QuTooltip.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" :aria-label="action.label" :icon="action.icon" />
      </QuTooltip.Activator>

      <QuTooltip.Content>{{ action.label }}</QuTooltip.Content>
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
