<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef, toRef } from 'vue'

  const LIMIT = 60

  const status = shallowRef('Hiking the ridge above the lake this weekend, back late on Sunday')

  // The counter stays hidden until the text is within 20% of the limit.
  const counter = toRef(() => status.value.length >= LIMIT * 0.8 ? LIMIT : undefined)
</script>

<template>
  <div class="quantum-docs-errors-fields">
    <QuTextField v-model="status" :counter label="Status" />
  </div>
</template>

<style>
  .quantum-docs-errors-fields {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    max-width: 360px;
  }
</style>
