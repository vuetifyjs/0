<script lang="ts">
  // Context
  import { orphan, useMd1ListItem } from './context'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ListSecondary' })

  defineSlots<{
    /** The second line, or the second and third lines of a three-line tile (clamped to two). */
    default?: () => any
  }>()

  orphan('Md1ListSecondary', 'Md1List.Item', useMd1ListItem())
</script>

<template>
  <span class="md1-list__secondary">
    <slot />
  </span>
</template>
