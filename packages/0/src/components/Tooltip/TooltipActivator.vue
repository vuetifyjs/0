/**
 * @module TooltipActivator
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tooltip
 *
 * @remarks
 * Tooltip trigger element. Binds pointer, focus, and escape events and
 * exposes them on slot attrs for renderless usage. Touch interactions
 * are suppressed per WAI-ARIA APG. Keyboard focus opens the tooltip
 * instantly (no delay), gated on :focus-visible so a mouse click that
 * incidentally moves focus does not open the tooltip.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTooltipRoot } from './TooltipRoot.vue'

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
      'aria-disabled': boolean | undefined
      'disabled': boolean | undefined
      'type': 'button' | undefined
      'data-disabled': true | undefined
      'onPointerenter': (e: PointerEvent) => void
      'onPointerleave': (e: PointerEvent) => void
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

  function onPointerenter (e: PointerEvent) {
    if (e.pointerType === 'touch') return
    root.open()
  }

  function onPointerleave (e: PointerEvent) {
    if (e.pointerType === 'touch') return
    root.close()
  }

  function onFocus (e: FocusEvent) {
    if (!(e.target as HTMLElement).matches(':focus-visible')) return
    root.cancel()
    root.open(true)
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

  const slotProps = toRef((): TooltipActivatorSlotProps => ({
    isOpen: root.isOpen.value,
    isDisabled: root.isDisabled.value,
    attrs: {
      'aria-describedby': root.id,
      'data-state': root.dataState.value,
      'aria-disabled': as === 'button' ? undefined : root.isDisabled.value,
      'disabled': as === 'button' ? root.isDisabled.value : undefined,
      'type': as === 'button' ? 'button' : undefined,
      'data-disabled': root.isDisabled.value || undefined,
      'onPointerenter': onPointerenter,
      'onPointerleave': onPointerleave,
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
