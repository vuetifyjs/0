<script setup lang="ts">
  import { computed } from 'vue'

  import { createFileTree, provideFileTree, source, toRegistration } from './context'
  import type { FileMeta } from './context'
  import type { ID } from '@vuetify/v0'

  const tree = createFileTree()

  tree.onboard(source.map(toRegistration))
  tree.open('src')

  function meta (id: ID) {
    return tree.get(id)?.value as FileMeta | undefined
  }

  const stats = computed(() => ({
    total: tree.size,
    selected: tree.selectedIds.size,
    opened: tree.openedIds.size,
  }))

  provideFileTree({ ...tree, meta, stats })
</script>

<template>
  <slot />
</template>
