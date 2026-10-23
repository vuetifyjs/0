<script lang="ts">
  // Context
  import { orphan, useMd1ListItem } from './context'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ListPrimary' })

  defineSlots<{
    /** The first line: the most distinguishing content of the tile. */
    default?: () => any
  }>()

  orphan('Md1ListPrimary', 'Md1List.Item', useMd1ListItem())
</script>

<template>
  <span class="md1-list__primary">
    <slot />
  </span>
</template>
