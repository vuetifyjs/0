/**
 * @module ExpansionPanelContent
 *
 * @remarks
 * Content container for an expansion panel item that displays when the panel is expanded.
 * Consumes the ExpansionPanelItemContext via dependency injection and provides ARIA region
 * attributes for accessibility.
 *
 * Automatically manages ARIA labelledby relationship with the corresponding header element.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { toRef } from 'vue'

  // Composables
  import { useExpansionPanelItem } from './ExpansionPanelItem.vue'

  export interface ExpansionPanelContentProps extends AtomProps {
    namespace?: string
  }

  export interface ExpansionPanelContentSlotProps {
    /** Whether this panel is currently selected/expanded */
    isSelected: boolean
    /** Attributes to bind to the content element for accessibility */
    attrs: {
      /** Data attribute for selected state */
      'data-selected': boolean
      /** Unique ID for the content region */
      'id': string
      /** ARIA role for accessibility */
      'role': 'region'
      /** ARIA labelledby attribute pointing to header element */
      'aria-labelledby': string
      /** Whether the content is hidden */
      'hidden': boolean
    }
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'ExpansionPanelContent' })

  defineSlots<{
    default: (props: ExpansionPanelContentSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:expansion-panel',
  } = defineProps<ExpansionPanelContentProps>()

  const item = useExpansionPanelItem(namespace)

  const slotProps = toRef((): ExpansionPanelContentSlotProps => ({
    isSelected: item.ticket.isSelected.value,
    attrs: {
      'data-selected': item.ticket.isSelected.value,
      'id': item.contentId.value,
      'role': 'region',
      'aria-labelledby': item.headerId.value,
      'hidden': !item.ticket.isSelected.value,
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
