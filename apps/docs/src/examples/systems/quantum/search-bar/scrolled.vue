<script setup lang="ts">
  import { QuSearchBar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const query = shallowRef('')
  const scrolled = shallowRef(false)

  const notes = Array.from({ length: 12 }, (_, index) => `Note ${index + 1}: groceries, errands and the week ahead`)

  function onScroll (event: Event) {
    scrolled.value = (event.target as HTMLElement).scrollTop > 0
  }
</script>

<template>
  <div class="quantum-docs-search-scroller" @scroll="onScroll">
    <div class="quantum-docs-search-sticky">
      <QuSearchBar v-model="query" placeholder="Search notes" :scrolled />
    </div>

    <p v-for="note in notes" :key="note" class="quantum-docs-search-line quantum-type-body-1">{{ note }}</p>
  </div>
</template>

<style>
  /* A scrolling page: the bar stays pinned at the top and rises to 3 dp once content passes under it. */
  .quantum-docs-search-scroller {
    height: 280px;
    overflow-y: auto;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-search-sticky {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-search-line {
    margin: 0;
    padding: var(--quantum-spacing-1, 8px) var(--quantum-spacing-2, 16px);
  }
</style>
