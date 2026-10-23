<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const query = shallowRef('')
</script>

<template>
  <div class="md1-docs-search">
    <Md1TextField
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
  .md1-docs-search {
    max-width: 480px;
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-background, #FAFAFA);
  }
</style>
