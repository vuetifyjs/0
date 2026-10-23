<script setup lang="ts">
  import { Md1SearchBar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const query = shallowRef('')
  const submitted = shallowRef<string>()

  const recent = ['Lisbon', 'Hiking trails near me']
  const places = ['Lima', 'Lille', 'Limerick', 'Ljubljana', 'Lyon']

  function onSubmit (value: string) {
    submitted.value = value
  }
</script>

<template>
  <div class="md1-docs-search">
    <Md1SearchBar v-model="query" placeholder="Search places" @submit="onSubmit">
      <Md1SearchBar.Item v-for="item in recent" :key="`recent:${item}`" history :value="item" />

      <Md1SearchBar.Item v-for="item in places" :key="`place:${item}`" :value="item" />
    </Md1SearchBar>

    <span v-if="submitted" class="md1-docs-note" role="status">Searched for "{{ submitted }}"</span>
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
