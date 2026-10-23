<script lang="ts">
  // Context
  import { orphan, useMd1ListItem } from './context'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ListContent' })

  defineSlots<{
    /** `Md1List.Primary` then `Md1List.Secondary`. */
    default?: () => any
  }>()

  orphan('Md1ListContent', 'Md1List.Item', useMd1ListItem())
</script>

<template>
  <span class="md1-list__content">
    <slot />
  </span>
</template>
