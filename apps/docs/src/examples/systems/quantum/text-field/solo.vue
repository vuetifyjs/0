<script setup lang="ts">
  import { QuTextField } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const query = shallowRef('')
</script>

<template>
  <div class="quantum-docs-search">
    <QuTextField
      v-model="query"
      clearable
      icon="search"
      label="Search"
      placeholder="Search"
      solo
      type="search"
      voice
    />
  </div>
</template>

<style>
  .quantum-docs-search {
    max-width: 480px;
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-background, #FAFAFA);
  }
</style>
