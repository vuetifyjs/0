<script setup lang="ts">
  import { QuButton, QuDialog } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuDialog :dismissible="false">
      <QuDialog.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" variant="raised">Accept terms</QuButton>
      </QuDialog.Activator>

      <QuDialog.Content>
        <QuDialog.Title>Accept the updated terms?</QuDialog.Title>

        <QuDialog.Text>The service terms changed on October 1. Accept them to keep syncing, or decline to stay signed out.</QuDialog.Text>

        <QuDialog.Actions>
          <QuDialog.Cancel>Decline</QuDialog.Cancel>

          <QuDialog.Confirm>Accept</QuDialog.Confirm>
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
