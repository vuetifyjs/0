/**
 * @module TreeviewGroup
 *
 * @see https://0.vuetifyjs.com/components/disclosure/treeview
 *
 * @remarks
 * Nested children container. Renders a ul with role="group".
 * Semantic wrapper for child items within a tree node.
 */

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { TreeviewGroupProps, TreeviewGroupSlotProps } from './types'

  defineOptions({ name: 'TreeviewGroup' })

  defineSlots<{
    default: (props: TreeviewGroupSlotProps) => any
  }>()

  const {
    as = 'ul',
    renderless,
  } = defineProps<TreeviewGroupProps>()

  const slotProps = toRef((): TreeviewGroupSlotProps => ({
    attrs: {
      role: 'group',
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
