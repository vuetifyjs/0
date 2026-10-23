<script setup lang="ts">
  import { QuDatePicker } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const date = shallowRef('2017-04-13')
</script>

<template>
  <!-- data-grid opts the calendar table out of the docs prose table style; the picker paints itself. -->
  <div class="quantum-docs-stack" data-grid>
    <div class="quantum-docs-picker quantum-elevation-24">
      <QuDatePicker v-model="date" :first-day-of-week="1" />
    </div>
  </div>
</template>

<style>
  .quantum-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-picker {
    margin: var(--quantum-spacing-3, 24px);
    border-radius: var(--quantum-radius, 2px);
  }
</style>
