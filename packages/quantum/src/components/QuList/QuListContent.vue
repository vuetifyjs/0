<script lang="ts">
  // Context
  import { orphan, useQuListItem } from './context'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuListContent' })

  defineSlots<{
    /** `QuList.Primary` then `QuList.Secondary`. */
    default?: () => any
  }>()

  orphan('QuListContent', 'QuList.Item', useQuListItem())
</script>

<template>
  <span class="quantum-list__content">
    <slot />
  </span>
</template>
