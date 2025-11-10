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
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useContext } from '#v0/composables'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ExpansionPanelItemContext } from './ExpansionPanelItem.vue'

  export interface ExpansionPanelContentProps extends AtomProps {
    /** Namespace for retrieving the parent ExpansionPanelItem context (default: 'v0:expansion-panel-item') */
    itemNamespace?: string
  }

  export interface ExpansionPanelContentSlotProps {
    /** Unique ID for the content region */
    'id': string
    /** ARIA role for accessibility */
    'role': 'region'
    /** ARIA labelledby attribute pointing to header element */
    'aria-labelledby': string
    /** Whether this panel is currently selected/expanded */
    'isSelected': boolean
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'ExpansionPanelContent' })

  defineSlots<{
    default: (props: ExpansionPanelContentSlotProps) => any
  }>()

  const {
    as,
    renderless,
    itemNamespace = 'v0:expansion-panel-item',
  } = defineProps<ExpansionPanelContentProps>()

  const context = useContext<ExpansionPanelItemContext>(itemNamespace)

  const bindableProps = computed<ExpansionPanelContentSlotProps>(() => ({
    'id': context.contentId.value,
    'role': 'region',
    'aria-labelledby': context.headerId.value,
    'isSelected': context.ticket.isSelected.value,
  }))
</script>

<template>
  <Atom
    :id="bindableProps.id"
    :aria-labelledby="bindableProps['aria-labelledby']"
    :as
    :renderless
    :role="bindableProps.role"
  >
    <slot v-bind="bindableProps" />
  </Atom>
</template>
