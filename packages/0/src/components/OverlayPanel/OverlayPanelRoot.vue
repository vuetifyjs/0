/**
 * @module OverlayPanelRoot
 *
 * @see https://0.vuetifyjs.com/components/disclosure/overlay-panel
 *
 * @remarks
 * Root component for overlay panel contexts. Creates and provides overlay context
 * to child OverlayPanel components. Manages open/closed state via v-model binding.
 *
 * OverlayPanel is a position-agnostic, non-modal floating overlay primitive that
 * combines portal, focus management, escape dismissal, and click-outside behavior.
 * Unlike Dialog (which uses native modal) or Popover (which uses CSS anchor positioning),
 * OverlayPanel leaves positioning entirely to the consumer.
 */

<script lang="ts">
  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ShallowRef } from 'vue'

  export interface OverlayPanelContext {
    isOpen: ShallowRef<boolean>
    id: string
    open: () => void
    close: () => void
    toggle: () => void
  }

  export interface OverlayPanelRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Unique identifier for the overlay panel (auto-generated if not provided) */
    id?: string
  }

  export interface OverlayPanelRootSlotProps {
    /** Unique identifier */
    id: string
    /** Whether the overlay panel is currently open */
    isOpen: boolean
    /** Open the overlay panel */
    open: () => void
    /** Close the overlay panel */
    close: () => void
    /** Toggle the overlay panel open/closed state */
    toggle: () => void
  }

  export const [useOverlayPanelContext, provideOverlayPanelContext] = createContext<OverlayPanelContext>()
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { useId } from '#v0/utilities'
  import { toRef } from 'vue'

  defineOptions({ name: 'OverlayPanelRoot' })

  defineSlots<{
    default: (props: OverlayPanelRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    as = null,
    namespace = 'v0:overlay-panel',
    id: _id,
  } = defineProps<OverlayPanelRootProps>()

  const isOpen = defineModel<boolean>({ default: false })

  const id = _id ?? useId()

  function open () {
    isOpen.value = true
  }

  function close () {
    isOpen.value = false
  }

  function toggle () {
    isOpen.value = !isOpen.value
  }

  provideOverlayPanelContext(namespace, {
    isOpen,
    id,
    open,
    close,
    toggle,
  })

  const slotProps = toRef((): OverlayPanelRootSlotProps => ({
    id,
    isOpen: isOpen.value,
    open,
    close,
    toggle,
  }))
</script>

<template>
  <Atom
    :as
    renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
