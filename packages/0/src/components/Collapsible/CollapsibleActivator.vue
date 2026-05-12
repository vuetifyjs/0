/**
 * @module CollapsibleActivator
 *
 * @see https://0.vuetifyjs.com/components/disclosure/collapsible
 *
 * @remarks
 * Toggle button for a collapsible disclosure. Consumes the CollapsibleContext
 * via dependency injection and provides complete ARIA attributes and keyboard
 * handling for accessibility.
 *
 * Automatically handles Enter and Space key presses, prevents default behavior,
 * and toggles the open state. Manages disabled state, tabindex, and ARIA relationships.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useCollapsible } from './CollapsibleRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface CollapsibleActivatorProps extends AtomProps {
    namespace?: string
  }

  export interface CollapsibleActivatorSlotProps {
    /** Whether the collapsible is open */
    isOpen: boolean
    /** Whether the collapsible is disabled */
    isDisabled: boolean
    /** Toggle the collapsible */
    toggle: () => void
    /** Attributes to bind to the activator element for accessibility */
    attrs: {
      /** Unique ID for the activator element */
      'id': string
      /** ARIA role for accessibility (only set when not using native button) */
      'role': 'button' | undefined
      /** Tab index for keyboard navigation */
      'tabindex': number
      /** ARIA expanded state */
      'aria-expanded': boolean
      /** ARIA controls attribute pointing to content region */
      'aria-controls': string
      /** ARIA disabled state (for non-button elements) */
      'aria-disabled': boolean | undefined
      /** Data attribute for open/closed state */
      'data-state': 'open' | 'closed'
      /** Data attribute for disabled state */
      'data-disabled': true | undefined
      /** Disabled attribute for native button elements */
      'disabled': boolean | undefined
      /** Type attribute for native button elements */
      'type': 'button' | undefined
      /** Click handler to toggle */
      'onClick': () => void
      /** Keyboard handler for Enter and Space keys */
      'onKeydown': (e: KeyboardEvent) => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CollapsibleActivator' })

  defineSlots<{
    default: (props: CollapsibleActivatorSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:collapsible',
  } = defineProps<CollapsibleActivatorProps>()

  const context = useCollapsible(namespace)

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      context.toggle()
    }
  }

  const slotProps = toRef((): CollapsibleActivatorSlotProps => ({
    isOpen: context.open.value,
    isDisabled: context.disabled.value,
    toggle: context.toggle,
    attrs: {
      'id': context.activatorId.value,
      'role': as === 'button' ? undefined : 'button',
      'tabindex': context.disabled.value ? -1 : 0,
      'aria-expanded': context.open.value,
      'aria-controls': context.contentId.value,
      'aria-disabled': as === 'button' ? undefined : context.disabled.value,
      'data-state': context.open.value ? 'open' : 'closed',
      'data-disabled': context.disabled.value || undefined,
      'disabled': as === 'button' ? context.disabled.value : undefined,
      'type': as === 'button' ? 'button' : undefined,
      'onClick': context.toggle,
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
