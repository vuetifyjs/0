/**
 * @module TooltipContent
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tooltip
 *
 * @remarks
 * Tooltip content surface. Renders role="tooltip", the native popover
 * attribute, anchor positioning styles, and direction data attributes.
 * In interactive mode (set on Tooltip.Root), pointer enter/leave handlers
 * cancel and re-arm the close timer so the user can move into the content
 * without dismissing it.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTooltipRoot } from './TooltipRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { TooltipState } from './TooltipRoot.vue'

  export interface TooltipContentProps extends AtomProps {
    namespace?: string
  }

  export interface TooltipContentSlotProps {
    isOpen: boolean
    isInteractive: boolean
    attrs: {
      'id': string
      'role': 'tooltip'
      'popover': ''
      'data-state': TooltipState
      'data-interactive': true | undefined
      'onPointerenter': (e: PointerEvent) => void
      'onPointerleave': (e: PointerEvent) => void
    }
    styles: Record<string, string>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TooltipContent', inheritAttrs: false })

  const attrs = useAttrs()
  const atomRef = useTemplateRef('atom')

  defineSlots<{
    default: (props: TooltipContentSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:tooltip',
  } = defineProps<TooltipContentProps>()

  const root = useTooltipRoot(namespace)

  root.attach(() => atomRef.value?.element)

  function onPointerenter () {
    if (!root.isInteractive.value) return
    root.cancel()
  }

  function onPointerleave () {
    if (!root.isInteractive.value) return
    root.close()
  }

  const slotProps = toRef((): TooltipContentSlotProps => ({
    isOpen: root.isOpen.value,
    isInteractive: root.isInteractive.value,
    attrs: {
      ...root.contentAttrs.value,
      'role': 'tooltip',
      'data-state': root.dataState.value,
      'data-interactive': root.isInteractive.value || undefined,
      'onPointerenter': onPointerenter,
      'onPointerleave': onPointerleave,
    },
    styles: root.contentStyles.value,
  }))
</script>

<template>
  <Atom
    ref="atom"
    :as
    :renderless
    :style="slotProps.styles"
    v-bind="mergeProps(attrs, slotProps.attrs)"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
