<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const amount = shallowRef('')
  const weight = shallowRef('12')
  const user = shallowRef('')
</script>

<template>
  <div class="quantum-docs-fields">
    <QuTextField v-model="amount" inputmode="decimal" label="Amount" prefix="$" />

    <QuTextField v-model="weight" inputmode="decimal" label="Weight" suffix="kg" />

    <QuTextField v-model="user" label="Email" suffix="@example.com" />
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
