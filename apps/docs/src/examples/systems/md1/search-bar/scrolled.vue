<script setup lang="ts">
  import { Md1SearchBar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const query = shallowRef('')
  const scrolled = shallowRef(false)

  const notes = Array.from({ length: 12 }, (_, index) => `Note ${index + 1}: groceries, errands and the week ahead`)

  function onScroll (event: Event) {
    scrolled.value = (event.target as HTMLElement).scrollTop > 0
  }
</script>

<template>
  <div class="md1-docs-search-scroller" @scroll="onScroll">
    <div class="md1-docs-search-sticky">
      <Md1SearchBar v-model="query" placeholder="Search notes" :scrolled />
    </div>

    <p v-for="note in notes" :key="note" class="md1-docs-search-line md1-type-body-1">{{ note }}</p>
  </div>
</template>

<style>
  /* A scrolling page: the bar stays pinned at the top and rises to 3 dp once content passes under it. */
  .md1-docs-search-scroller {
    height: 280px;
    overflow-y: auto;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-search-sticky {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: var(--md1-spacing-2, 16px);
  }

  /* Two classes: the docs shell's `.markdown-body p` margin would otherwise win. */
  .md1-docs-search-scroller .md1-docs-search-line {
    margin: 0;
    padding: var(--md1-spacing-1, 8px) var(--md1-spacing-2, 16px);
  }
</style>
