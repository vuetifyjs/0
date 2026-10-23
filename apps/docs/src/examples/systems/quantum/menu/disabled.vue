<script setup lang="ts">
  import { QuButton, QuMenu } from '@paper/quantum'

  import { shallowRef } from 'vue'

  // Nothing to redo and nothing selected yet: those items stay in place, disabled.
  const history = shallowRef(0)
</script>

<template>
  <div class="quantum-docs-row">
    <QuMenu>
      <QuMenu.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs">Edit</QuButton>
      </QuMenu.Activator>

      <QuMenu.Content>
        <QuMenu.Item @select="history++">Undo</QuMenu.Item>

        <QuMenu.Item disabled>Redo</QuMenu.Item>

        <QuMenu.Divider />

        <QuMenu.Item disabled>Cut</QuMenu.Item>

        <QuMenu.Item disabled>Copy</QuMenu.Item>

        <QuMenu.Item>Paste</QuMenu.Item>
      </QuMenu.Content>
    </QuMenu>

    <span v-if="history > 0" class="quantum-docs-note" role="status">Undone {{ history }}x</span>
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
