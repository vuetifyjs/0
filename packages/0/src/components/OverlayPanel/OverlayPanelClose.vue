/**
 * @module OverlayPanelClose
 *
 * @see https://0.vuetifyjs.com/components/disclosure/overlay-panel
 *
 * @remarks
 * Close button component for closing the overlay panel.
 * Provides proper ARIA attributes and keyboard accessibility.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface OverlayPanelCloseProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface OverlayPanelCloseSlotProps {
    /** Attributes to bind to the close element */
    attrs: {
      'type': 'button' | undefined
      'role': 'button' | undefined
      'tabindex': number
      'aria-label': string
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

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  defineOptions({ name: 'OverlayPanelClose', inheritAttrs: false })

  defineSlots<{
    default: (props: OverlayPanelCloseSlotProps) => any
  }>()

  const {
    as = 'button',
    namespace = 'v0:overlay-panel',
    renderless,
  } = defineProps<OverlayPanelCloseProps>()

  const attrs = useAttrs()
  const context = useOverlayPanelContext(namespace)
  const locale = useLocale()

  function onClick () {
    context.close()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  const slotProps = toRef((): OverlayPanelCloseSlotProps => ({
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'role': as === 'button' ? undefined : 'button',
      'tabindex': 0,
      'aria-label': locale.ti('OverlayPanel.close') ?? 'Close',
      'onClick': onClick,
      'onKeydown': as === 'button' ? undefined : onKeydown,
    },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="mergeProps(attrs, slotProps.attrs)"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
