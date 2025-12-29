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
  import { useExpansionPanelItem } from './ExpansionPanelItem.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ExpansionPanelActivatorProps extends AtomProps {
    namespace?: string
  }

  export interface ExpansionPanelActivatorSlotProps {
    /** Disabled state */
    isDisabled: boolean
    /** Whether this panel is currently selected/expanded */
    isSelected: boolean
    /** Toggle the panels expansion state */
    toggle: () => void
    /** Attributes to bind to the activator element for accessibility */
    attrs: {
      /** Unique ID for the header/activator element */
      'id': string
      /** ARIA role for accessibility (only set when not using native button) */
      'role': 'button' | undefined
      /** Tab index for keyboard navigation */
      'tabindex': number
      /** ARIA expanded state */
      'aria-expanded': boolean
      /** ARIA controls attribute pointing to content region */
      'aria-controls': string
      /** ARIA disabled state */
      'aria-disabled': boolean
      /** Data attribute for disabled state */
      'data-disabled': true | undefined
      /** Data attribute for selected state */
      'data-selected': true | undefined
      /** Disabled attribute for native button elements */
      'disabled': boolean | undefined
      /** Type attribute for native button elements */
      'type': 'button' | undefined
      /** Click handler to toggle panel */
      'onClick': () => void
      /** Keyboard handler for Enter and Space keys */
      'onKeydown': (e: KeyboardEvent) => void
    }
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
    namespace = 'v0:expansion-panel',
  } = defineProps<ExpansionPanelActivatorProps>()

  const item = useExpansionPanelItem(namespace)

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      item.ticket.toggle()
    }
  }

  const slotProps = toRef((): ExpansionPanelActivatorSlotProps => ({
    isDisabled: item.isDisabled.value,
    isSelected: item.ticket.isSelected.value,
    toggle: item.ticket.toggle,
    attrs: {
      'id': item.headerId.value,
      'role': as === 'button' ? undefined : 'button',
      'tabindex': item.isDisabled.value ? -1 : 0,
      'aria-expanded': item.ticket.isSelected.value,
      'aria-controls': item.contentId.value,
      'aria-disabled': item.isDisabled.value,
      'data-disabled': item.isDisabled.value || undefined,
      'data-selected': item.ticket.isSelected.value || undefined,
      'disabled': as === 'button' ? item.isDisabled.value : undefined,
      'type': as === 'button' ? 'button' : undefined,
      'onClick': item.ticket.toggle,
      onKeydown,
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
