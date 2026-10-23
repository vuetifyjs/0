<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const name = shallowRef('')
  const city = shallowRef('Lisbon')
</script>

<template>
  <div class="quantum-docs-fields">
    <QuTextField v-model="name" helper="As it appears on your card" label="Full name" />

    <QuTextField v-model="city" label="City" />
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
