<script lang="ts">
  // Context
  import { orphan, useQuListItem } from './context'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuListPrimary' })

  defineSlots<{
    /** The first line: the most distinguishing content of the tile. */
    default?: () => any
  }>()

  orphan('QuListPrimary', 'QuList.Item', useQuListItem())
</script>

<template>
  <span class="quantum-list__primary">
    <slot />
  </span>
</template>
