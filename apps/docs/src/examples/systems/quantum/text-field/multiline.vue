<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const note = shallowRef('Leave the parcel with the neighbour at number 12.\nRing twice.')
</script>

<template>
  <div class="quantum-docs-fields">
    <QuTextField v-model="note" label="Delivery note" multiline />
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
