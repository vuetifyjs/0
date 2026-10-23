<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const first = shallowRef('Grace')
  const last = shallowRef('')
  const company = shallowRef('')
</script>

<template>
  <div class="quantum-docs-fields-dense">
    <QuTextField v-model="first" dense label="First name" />

    <QuTextField v-model="last" dense label="Last name" />

    <QuTextField v-model="company" dense helper="Leave empty for personal accounts" label="Company" />
  </div>
</template>

<style>
  .quantum-docs-fields-dense {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-1, 8px);
    max-width: 360px;
  }
</style>
