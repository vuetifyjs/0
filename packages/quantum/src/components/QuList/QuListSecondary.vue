<script lang="ts">
  // Context
  import { orphan, useQuListItem } from './context'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuListSecondary' })

  defineSlots<{
    /** The second line, or the second and third lines of a three-line tile (clamped to two). */
    default?: () => any
  }>()

  orphan('QuListSecondary', 'QuList.Item', useQuListItem())
</script>

<template>
  <span class="quantum-list__secondary">
    <slot />
  </span>
</template>
