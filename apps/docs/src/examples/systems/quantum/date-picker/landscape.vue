<script setup lang="ts">
  import { QuButton, QuDatePicker, QuDialog } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const date = shallowRef<unknown>('2017-04-13')
</script>

<template>
  <!-- data-grid opts the calendar table out of the docs prose table style; the picker paints itself. -->
  <div class="quantum-docs-row" data-grid>
    <QuDialog v-model:value="date" variant="confirmation">
      <QuDialog.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" icon="event">Landscape</QuButton>
      </QuDialog.Activator>

      <QuDialog.Content aria-label="Pick a date">
        <QuDatePicker landscape />

        <QuDialog.Actions>
          <QuDialog.Cancel />

          <QuDialog.Confirm />
        </QuDialog.Actions>
      </QuDialog.Content>
    </QuDialog>

    <span class="quantum-docs-note" role="status">{{ date }}</span>
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
