/**
 * @module TreeviewIndicator
 *
 * @see https://0.vuetifyjs.com/components/disclosure/treeview
 *
 * @remarks
 * Visual indicator for selection state within a TreeviewCheckbox.
 * Consumes TreeviewItem context. Self-hides when unchecked and not
 * mixed. Exposes data-state="checked|unchecked|indeterminate" for
 * CSS-driven styling.
 */

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTreeviewItem } from './TreeviewItem.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { TreeviewIndicatorProps, TreeviewIndicatorSlotProps } from './types'

  defineOptions({ name: 'TreeviewIndicator' })

  defineSlots<{
    default: (props: TreeviewIndicatorSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:treeview',
  } = defineProps<TreeviewIndicatorProps>()

  const item = useTreeviewItem(namespace)!

  const isSelected = toRef(() => toValue(item.ticket.isSelected))
  const isMixed = toRef(() => toValue(item.ticket.isMixed))
  const isVisible = toRef(() => isSelected.value || isMixed.value)
  const state = toRef((): 'checked' | 'unchecked' | 'indeterminate' =>
    isMixed.value
      ? 'indeterminate'
      : (isSelected.value ? 'checked' : 'unchecked'),
  )

  const slotProps = toRef((): TreeviewIndicatorSlotProps => ({
    isSelected: isSelected.value,
    isMixed: isMixed.value,
    attrs: {
      'aria-hidden': true,
      'data-state': state.value,
      'style': { visibility: isVisible.value ? 'visible' : 'hidden' },
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
