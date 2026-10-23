<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const password = shallowRef('correct horse')
</script>

<template>
  <div class="quantum-docs-fields">
    <QuTextField
      v-model="password"
      autocomplete="current-password"
      label="Password"
      type="password"
    />
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
