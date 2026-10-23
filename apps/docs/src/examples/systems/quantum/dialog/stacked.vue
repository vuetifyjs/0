<script setup lang="ts">
  import { QuButton, QuDialog } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuDialog>
      <QuDialog.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" variant="raised">Location history</QuButton>
      </QuDialog.Activator>

      <QuDialog.Content>
        <QuDialog.Title>Use location history?</QuDialog.Title>

        <QuDialog.Text>Saved places and routes improve your recommendations.</QuDialog.Text>

        <QuDialog.Actions>
          <QuDialog.Cancel>Not now</QuDialog.Cancel>

          <QuDialog.Confirm>Turn on location history</QuDialog.Confirm>
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
