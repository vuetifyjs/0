<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const password = shallowRef('correct horse')
</script>

<template>
  <div class="md1-docs-fields">
    <Md1TextField
      v-model="password"
      autocomplete="current-password"
      label="Password"
      type="password"
    />
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
