<script setup lang="ts">
  import { Md1SearchBar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const query = shallowRef('')

  const recent = ['Beach sunset', 'Birthday 2016', 'Cats']
  const labels = ['Bears', 'Bees', 'Berries', 'Bicycles', 'Boats', 'Bridges']
</script>

<template>
  <div class="md1-docs-search">
    <Md1SearchBar v-model="query" placeholder="Search photos">
      <Md1SearchBar.Item v-for="item in recent" :key="`recent:${item}`" history :value="item" />

      <Md1SearchBar.Item v-for="item in labels" :key="`label:${item}`" :value="item" />

      <Md1SearchBar.Empty v-slot="{ query: missed }">No photos match "{{ missed }}"</Md1SearchBar.Empty>
    </Md1SearchBar>

    <span class="md1-docs-note">Focus the field for recent searches, type "b" for completions, or "zz" for no match.</span>
  </div>
</template>

<style>
  /* The page behind the bar: the theme background, so the 2 dp sheet reads as raised. */
  .md1-docs-search {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
