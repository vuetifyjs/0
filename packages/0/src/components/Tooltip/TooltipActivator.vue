<!--
  @module TooltipActivator

  @see https://0.vuetifyjs.com/components/disclosure/tooltip

  @remarks
  Tooltip trigger element. Binds pointer / focus / escape events and
  exposes them on slot `attrs` for renderless usage. Touch interactions
  are suppressed per WAI-ARIA APG; keyboard focus is always instant.
-->

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTooltipRoot } from './TooltipRoot.vue'

  // Composables
  import { useEventListener } from '#v0/composables/useEventListener'

  // Utilities
  import { mergeProps, shallowRef, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TooltipActivatorProps extends AtomProps {
    namespace?: string
  }

  export interface TooltipActivatorSlotProps {
    isOpen: boolean
    isDisabled: boolean
    attrs: {
      'aria-describedby': string | undefined
      'data-state': 'open' | 'closed' | 'delayed-open' | 'instant-open'
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

  const recentPointerdownAt = shallowRef(0)
  const POINTERDOWN_FOCUS_WINDOW = 50

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
    recentPointerdownAt.value = Date.now()
  }

  function onFocus () {
    if ((Date.now() - recentPointerdownAt.value) < POINTERDOWN_FOCUS_WINDOW) return
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
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
      root.close()
    }
  }

  useEventListener<KeyboardEvent>(
    () => globalThis.document?.documentElement,
    'keydown',
    e => {
      if (e.key === 'Escape' && root.isOpen.value) root.close()
    },
  )

  const slotProps = toRef((): TooltipActivatorSlotProps => ({
    isOpen: root.isOpen.value,
    isDisabled: root.isDisabled.value,
    attrs: {
      'aria-describedby': root.isOpen.value ? root.id : undefined,
      'data-state': root.dataState.value,
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
