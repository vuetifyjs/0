/**
 * @module ExpansionPanelActivator
 *
 * @remarks
 * Header/button element for an expansion panel item that controls expansion/collapse.
 * Consumes the ExpansionPanelItemContext via dependency injection and provides complete
 * ARIA attributes and keyboard handling for accessibility.
 *
 * Automatically handles Enter and Space key presses, prevents default behavior, and
 * toggles the panel state. Manages disabled state, tabindex, and ARIA relationships.
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

  export interface ExpansionPanelActivatorProps extends AtomProps {
    /** Namespace for retrieving the parent ExpansionPanelItem context (default: 'v0:expansion-panel-item') */
    itemNamespace?: string
  }

  export interface ExpansionPanelActivatorSlotProps {
    /** Unique ID for the header/activator element */
    'id': string
    /** ARIA role for accessibility */
    'role': 'button'
    /** Tab index for keyboard navigation */
    'tabindex': number
    /** ARIA expanded state */
    'aria-expanded': boolean
    /** ARIA controls attribute pointing to content region */
    'aria-controls': string
    /** ARIA disabled state */
    'aria-disabled': boolean
    /** Whether this panel is currently selected/expanded */
    'isSelected': boolean
    /** Toggle the panel's expansion state */
    'toggle': () => void
    /** Click handler to toggle panel */
    'onClick': () => void
    /** Keyboard handler for Enter and Space keys */
    'onKeydown': (e: KeyboardEvent) => void
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'ExpansionPanelActivator' })

  defineSlots<{
    default: (props: ExpansionPanelActivatorSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    itemNamespace = 'v0:expansion-panel-item',
  } = defineProps<ExpansionPanelActivatorProps>()

  const context = useContext<ExpansionPanelItemContext>(itemNamespace)

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      context.ticket.toggle()
    }
  }

  const bindableProps = computed<ExpansionPanelActivatorSlotProps>(() => ({
    'id': context.headerId.value,
    'role': 'button',
    'tabindex': context.isDisabled.value ? -1 : 0,
    'aria-expanded': context.ticket.isSelected.value,
    'aria-controls': context.contentId.value,
    'aria-disabled': context.isDisabled.value,
    'isSelected': context.ticket.isSelected.value,
    'toggle': context.ticket.toggle,
    'onClick': context.ticket.toggle,
    onKeydown,
  }))
</script>

<template>
  <Atom
    :id="bindableProps.id"
    :aria-controls="bindableProps['aria-controls']"
    :aria-disabled="bindableProps['aria-disabled']"
    :aria-expanded="bindableProps['aria-expanded']"
    :as
    :renderless
    :role="bindableProps.role"
    :tabindex="bindableProps.tabindex"
    @click="context.ticket.toggle"
    @keydown="onKeydown"
  >
    <slot v-bind="bindableProps" />
  </Atom>
</template>
