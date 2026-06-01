/**
 * @module TooltipActivator
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tooltip
 *
 * @remarks
 * Tooltip trigger element. Binds pointer, focus, and escape events and
 * exposes them on slot attrs for renderless usage. Touch interactions
 * are suppressed per WAI-ARIA APG. Keyboard focus respects openDelay
 * the same as hover, but is exempt from the pointerdown suppression
 * window so a click that incidentally moves focus does not double-trigger.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTooltipRoot } from './TooltipRoot.vue'

  // Composables
  import { useDocumentEventListener } from '#v0/composables/useEventListener'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TooltipActivatorProps extends AtomProps {
    namespace?: string
  }

  export interface TooltipActivatorSlotProps {
    isOpen: boolean
    isDisabled: boolean
    attrs: {
      'aria-describedby': string
      'data-state': 'closed' | 'delayed-open' | 'instant-open'
      'aria-disabled'?: boolean
      'data-disabled': true | undefined
      'onPointerenter': (e: PointerEvent) => void
      'onPointerleave': (e: PointerEvent) => void
      'onPointerdown': (e: PointerEvent) => void
      'onFocus': (e: FocusEvent) => void
      'onBlur': (e: FocusEvent) => void
      'onClick': () => void
      'onKeydown': (e: KeyboardEvent) => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TooltipActivator', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: TooltipActivatorSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:tooltip',
  } = defineProps<TooltipActivatorProps>()

  const root = useTooltipRoot(namespace)

  const POINTERDOWN_FOCUS_WINDOW = 50
  let recentPointerdownAt = 0

  function onPointerenter (e: PointerEvent) {
    if (e.pointerType === 'touch') return
    root.open()
  }

  function onPointerleave (e: PointerEvent) {
    if (e.pointerType === 'touch') return
    root.close()
  }

  function onPointerdown (e: PointerEvent) {
    if (e.pointerType === 'touch') return
    recentPointerdownAt = Date.now()
  }

  function onFocus () {
    if ((Date.now() - recentPointerdownAt) < POINTERDOWN_FOCUS_WINDOW) return
    root.cancel()
    root.open()
  }

  function onBlur () {
    root.cancel()
    root.close()
  }

  function onClick () {
    root.close()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Escape') {
      root.close()
    }
  }

  useDocumentEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && root.isOpen.value) root.close()
  })

  const slotProps = toRef((): TooltipActivatorSlotProps => ({
    isOpen: root.isOpen.value,
    isDisabled: root.isDisabled.value,
    attrs: {
      'aria-describedby': root.id,
      'data-state': root.dataState.value,
      'aria-disabled': root.isDisabled.value || undefined,
      'data-disabled': root.isDisabled.value || undefined,
      'onPointerenter': onPointerenter,
      'onPointerleave': onPointerleave,
      'onPointerdown': onPointerdown,
      'onFocus': onFocus,
      'onBlur': onBlur,
      'onClick': onClick,
      'onKeydown': onKeydown,
    },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    :style="root.anchorStyles.value"
    v-bind="mergeProps(attrs, slotProps.attrs)"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
