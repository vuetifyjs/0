<script setup lang="ts">
  import { QuDatePicker } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const date = shallowRef<string>()
</script>

<template>
  <!-- data-grid opts the calendar table out of the docs prose table style; the picker paints itself. -->
  <div class="quantum-docs-stack" data-grid>
    <div class="quantum-docs-picker quantum-elevation-24">
      <QuDatePicker v-model="date" />
    </div>

    <span class="quantum-docs-note" role="status">{{ date ?? 'No date selected' }}</span>
  </div>
</template>

<style>
  .quantum-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  /* The picker's own surface at the dialog's 24 dp, shown without the dialog so the anatomy reads at a glance. */
  .quantum-docs-picker {
    margin: var(--quantum-spacing-3, 24px);
    border-radius: var(--quantum-radius, 2px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
