<script setup lang="ts">
  import { QuSearchBar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const query = shallowRef('')

  const recent = ['Beach sunset', 'Birthday 2016', 'Cats']
  const labels = ['Bears', 'Bees', 'Berries', 'Bicycles', 'Boats', 'Bridges']
</script>

<template>
  <div class="quantum-docs-search">
    <QuSearchBar v-model="query" placeholder="Search photos">
      <QuSearchBar.Item v-for="item in recent" :key="`recent:${item}`" history :value="item" />

      <QuSearchBar.Item v-for="item in labels" :key="`label:${item}`" :value="item" />

      <QuSearchBar.Empty v-slot="{ query: missed }">No photos match "{{ missed }}"</QuSearchBar.Empty>
    </QuSearchBar>

    <span class="quantum-docs-note">Focus the field for recent searches, type "b" for completions, or "zz" for no match.</span>
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
