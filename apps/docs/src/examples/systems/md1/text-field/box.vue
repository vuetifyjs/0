<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const street = shallowRef('')
  const zip = shallowRef('1100')
</script>

<template>
  <div class="md1-docs-fields">
    <Md1TextField v-model="street" box helper="Street and number" label="Address" />

    <Md1TextField v-model="zip" box dense label="Postal code" />
  </div>
</template>

<style>
  .md1-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 360px;
  }
</style>
