/**
 * @module OverlayPanelActivator
 *
 * @see https://0.vuetifyjs.com/components/disclosure/overlay-panel
 *
 * @remarks
 * Activator component that toggles the overlay panel open/closed.
 * Provides proper ARIA attributes and keyboard accessibility.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface OverlayPanelActivatorProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface OverlayPanelActivatorSlotProps {
    /** Whether the overlay panel is currently open */
    isOpen: boolean
    /** Attributes to bind to the activator element */
    attrs: {
      'type': 'button' | undefined
      'role': 'button' | undefined
      'tabindex': number
      'aria-expanded': boolean
      'aria-haspopup': 'dialog'
      'aria-controls': string
      'data-open': true | undefined
      'onClick': () => void
      'onKeydown': ((e: KeyboardEvent) => void) | undefined
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useOverlayPanelContext } from './OverlayPanelRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'OverlayPanelActivator' })

  defineSlots<{
    default: (props: OverlayPanelActivatorSlotProps) => any
  }>()

  const {
    as = 'button',
    namespace = 'v0:overlay-panel',
    renderless,
  } = defineProps<OverlayPanelActivatorProps>()

  const context = useOverlayPanelContext(namespace)

  function onClick () {
    context.toggle()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  const slotProps = toRef((): OverlayPanelActivatorSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'role': as === 'button' ? undefined : 'button',
      'tabindex': 0,
      'aria-expanded': context.isOpen.value,
      'aria-haspopup': 'dialog',
      'aria-controls': context.id,
      'data-open': context.isOpen.value || undefined,
      'onClick': onClick,
      'onKeydown': as === 'button' ? undefined : onKeydown,
    },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
