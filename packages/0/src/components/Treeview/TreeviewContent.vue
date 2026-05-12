/**
 * @module TreeviewContent
 *
 * @see https://0.vuetifyjs.com/components/disclosure/treeview
 *
 * @remarks
 * Collapse gate for tree node children. Conditionally renders default slot
 * based on parent TreeviewItem's isOpen state. Renderless — no DOM output.
 */

<script setup lang="ts">
  // Context
  import { useTreeviewItem } from './TreeviewItem.vue'

  // Utilities
  import { onActivated, onBeforeUnmount, onDeactivated, toValue } from 'vue'

  // Types
  import type { TreeviewContentProps, TreeviewContentSlotProps } from './types'

  defineOptions({ name: 'TreeviewContent' })

  defineSlots<{
    default: (props: TreeviewContentSlotProps) => any
  }>()

  const {
    namespace = 'v0:treeview',
  } = defineProps<TreeviewContentProps>()

  const item = useTreeviewItem(namespace)!
  item.hasContent.value = true
  onDeactivated(() => {
    item.hasContent.value = false
  })
  onActivated(() => {
    item.hasContent.value = true
  })
  onBeforeUnmount(() => {
    item.hasContent.value = false
  })
</script>

<template>
  <slot
    v-if="toValue(item.ticket.isOpen)"
    :is-open="toValue(item.ticket.isOpen)"
  />
</template>
