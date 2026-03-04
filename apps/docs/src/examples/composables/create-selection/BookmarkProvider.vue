<script setup lang="ts">
  import { computed, shallowReactive } from 'vue'
  import { useProxyRegistry } from '@vuetify/v0'

  import { createBookmarks, provideBookmarks, type BookmarkInput } from './context'
  import type { ID } from '@vuetify/v0'

  const selection = createBookmarks()
  const proxy = useProxyRegistry(selection)
  const pinnedIds = shallowReactive(new Set<ID>())

  selection.onboard([
    { id: 'vue', value: 'Vue.js', url: 'https://vuejs.org', tags: ['framework'] },
    { id: 'vite', value: 'Vite', url: 'https://vite.dev', tags: ['tooling'] },
    { id: 'pinia', value: 'Pinia', url: 'https://pinia.vuejs.org', tags: ['framework'] },
    { id: 'vitest', value: 'Vitest', url: 'https://vitest.dev', tags: ['tooling'] },
    { id: 'mdn', value: 'MDN Web Docs', url: 'https://developer.mozilla.org', tags: ['reference'] },
    { id: 'caniuse', value: 'Can I Use', url: 'https://caniuse.com', tags: ['reference'] },
    { id: 'legacy', value: 'Legacy API (deprecated)', url: 'https://example.com', tags: ['reference'], disabled: true },
  ] satisfies BookmarkInput[])

  pinnedIds.add('vue')

  const stats = computed(() => ({
    total: proxy.size,
    selected: selection.selectedIds.size,
    pinned: pinnedIds.size,
  }))

  function add (title: string, url: string, tags: string[] = []) {
    return selection.register({ value: title, url, tags })
  }

  function pin (id: ID) {
    pinnedIds.add(id)
  }

  function unpin (id: ID) {
    pinnedIds.delete(id)
  }

  function pinned (id: ID) {
    return pinnedIds.has(id)
  }

  provideBookmarks({ ...selection, pinnedIds, stats, add, pin, unpin, pinned })
</script>

<template>
  <slot />
</template>
