<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const street = shallowRef('')
  const zip = shallowRef('1100')
</script>

<template>
  <div class="quantum-docs-fields">
    <QuTextField v-model="street" box helper="Street and number" label="Address" />

    <QuTextField v-model="zip" box dense label="Postal code" />
  </div>
</template>

<style>
  .quantum-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    max-width: 360px;
  }
</style>
