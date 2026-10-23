<script setup lang="ts">
  import { QuButton, QuDialog } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuDialog>
      <QuDialog.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" variant="raised">Erase storage</QuButton>
      </QuDialog.Activator>

      <QuDialog.Content>
        <QuDialog.Title>Erase USB storage?</QuDialog.Title>

        <QuDialog.Text>You'll lose all photos and media on it.</QuDialog.Text>

        <QuDialog.Actions>
          <QuDialog.Cancel />

          <QuDialog.Confirm>Erase</QuDialog.Confirm>
        </QuDialog.Actions>
      </QuDialog.Content>
    </QuDialog>
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
