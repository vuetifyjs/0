<script setup lang="ts">
  import { QuSearchBar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const query = shallowRef('')
  const submitted = shallowRef<string>()

  function onSubmit (value: string) {
    submitted.value = value
  }
</script>

<template>
  <div class="quantum-docs-search">
    <QuSearchBar v-model="query" button placeholder="Search the help center" @submit="onSubmit" />

    <span v-if="submitted" class="quantum-docs-note" role="status">Searched for "{{ submitted }}"</span>
  </div>
</template>

<style>
  /* The page behind the bar: the theme background, so the 2 dp sheet reads as raised. */
  .quantum-docs-search {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
