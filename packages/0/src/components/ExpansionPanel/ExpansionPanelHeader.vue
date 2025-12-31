/**
 * @module ExpansionPanelHeader
 *
 * @remarks
 * Semantic heading wrapper for the expansion panel activator. Renders a heading
 * element (h3 by default) that wraps the activator button for proper document
 * outline and screen reader navigation.
 *
 * Per WAI-ARIA accordion pattern, accordion triggers should be wrapped in
 * heading elements to enable heading-based navigation for screen reader users.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  // Composables
  import { useExpansionPanelItem } from './ExpansionPanelItem.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ExpansionPanelHeaderProps extends AtomProps {
    /** Namespace for retrieving the parent ExpansionPanelItem context (default: 'v0:expansion-panel') */
    namespace?: string
  }

  export interface ExpansionPanelHeaderSlotProps {
    /** Whether this panel is currently selected/expanded */
    isSelected: boolean
    /** Attributes to bind to the root element for accessibility */
    attrs: {
      /** Data attribute for selected state */
      'data-selected': true | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ExpansionPanelHeader' })

  defineSlots<{
    default: (props: ExpansionPanelHeaderSlotProps) => any
  }>()

  const {
    as = 'h3',
    renderless,
    namespace = 'v0:expansion-panel',
  } = defineProps<ExpansionPanelHeaderProps>()

  const item = useExpansionPanelItem(namespace)

  const slotProps = toRef((): ExpansionPanelHeaderSlotProps => ({
    isSelected: item.ticket.isSelected.value,
    attrs: {
      'data-selected': item.ticket.isSelected.value || undefined,
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
