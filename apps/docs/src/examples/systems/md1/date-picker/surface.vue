<script setup lang="ts">
  import { Md1DatePicker } from '@paper/md1'
  import { shallowRef } from 'vue'

  const date = shallowRef<string>()
</script>

<template>
  <!-- data-grid opts the calendar table out of the docs prose table style; the picker paints itself. -->
  <div class="md1-docs-stack" data-grid>
    <div class="md1-docs-picker md1-elevation-24">
      <Md1DatePicker v-model="date" />
    </div>

    <span class="md1-docs-note" role="status">{{ date ?? 'No date selected' }}</span>
  </div>
</template>

<style>
  .md1-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  /* The picker's own surface at the dialog's 24 dp, shown without the dialog so the anatomy reads at a glance. */
  .md1-docs-picker {
    margin: var(--md1-spacing-3, 24px);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
