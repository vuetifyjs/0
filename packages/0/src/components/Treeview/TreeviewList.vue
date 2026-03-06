/**
 * @module TreeviewList
 *
 * @remarks
 * Top-level list container for the treeview. Renders a ul with role="tree".
 * Sets aria-multiselectable based on prop (should match TreeviewRoot's multiple).
 */

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { TreeviewListProps, TreeviewListSlotProps } from './types'

  defineOptions({ name: 'TreeviewList' })

  defineSlots<{
    default: (props: TreeviewListSlotProps) => any
  }>()

  const {
    as = 'ul',
    renderless,
    multiselectable = true,
  } = defineProps<TreeviewListProps>()

  const slotProps = toRef((): TreeviewListSlotProps => ({
    attrs: {
      'role': 'tree',
      'aria-multiselectable': multiselectable,
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
