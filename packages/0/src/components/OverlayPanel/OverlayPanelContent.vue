/**
 * @module OverlayPanelContent
 *
 * @see https://0.vuetifyjs.com/components/disclosure/overlay-panel
 *
 * @remarks
 * Content component for overlay panels. Renders the overlay panel using Portal
 * for teleportation and integrates with useStack for z-index coordination.
 *
 * Features:
 * - Portal-based rendering with configurable teleport target
 * - Z-index coordination via useStack
 * - Escape key dismissal via useHotkey
 * - Click-outside dismissal via useClickOutside
 * - Focus return to activator on close
 * - Position-agnostic (consumer applies positioning)
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { Extensible } from '#v0/types'

  export interface OverlayPanelContentProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Teleport target. @default 'body' */
    to?: Extensible<'top-layer'> | HTMLElement
    /** Render inline instead of teleporting. @default false */
    disabled?: boolean
    /** Close overlay panel when clicking outside content @default true */
    closeOnClickOutside?: boolean
    /** Close overlay panel when pressing Escape @default true */
    closeOnEscape?: boolean
    /** Block scrim close. @default false */
    blocking?: boolean
    /** Whether a scrim/backdrop should back this panel. @default false */
    scrim?: boolean
  }

  export interface OverlayPanelContentSlotProps {
    /** Whether the overlay panel is currently open */
    isOpen: boolean
    /** Whether this overlay is the topmost in the global stack */
    globalTop: boolean
    /** Calculated z-index for the overlay */
    zIndex: number
    /** Attributes to bind to the content element */
    attrs: {
      'id': string
      'role': 'dialog'
      'aria-modal': 'false'
      'style': { zIndex: number, position: 'fixed' }
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useOverlayPanelContext } from './OverlayPanelRoot.vue'

  // Composables
  import { useClickOutside } from '#v0/composables/useClickOutside'
  import { useHotkey } from '#v0/composables/useHotkey'
  import { useStack } from '#v0/composables/useStack'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Utilities
  import { mergeProps, nextTick, onMounted, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  defineOptions({ name: 'OverlayPanelContent', inheritAttrs: false })

  defineSlots<{
    default: (props: OverlayPanelContentSlotProps) => any
  }>()

  const {
    as = 'div',
    namespace = 'v0:overlay-panel',
    to,
    disabled = false,
    closeOnClickOutside = true,
    closeOnEscape = true,
    blocking = false,
    scrim = false,
    renderless,
  } = defineProps<OverlayPanelContentProps>()

  const context = useOverlayPanelContext(namespace)
  const attrs = useAttrs()

  const contentRef = useTemplateRef('content')
  let previousActiveElement: Element | null = null

  const stack = useStack()
  const ticket = stack.register({
    onDismiss: () => context.close(),
    blocking: () => blocking,
    scrim: () => scrim,
    el: () => contentRef.value?.element,
  })

  watch(context.isOpen, isOpen => {
    if (isOpen) {
      previousActiveElement = document.activeElement
      ticket.select()
    } else {
      ticket.unselect()
    }
  }, { immediate: true })

  watch(context.isOpen, async isOpen => {
    if (!isOpen && previousActiveElement instanceof HTMLElement) {
      await nextTick()
      previousActiveElement.focus()
      previousActiveElement = null
    }
  })

  onMounted(() => {
    if (context.isOpen.value) {
      previousActiveElement = document.activeElement
    }
  })

  useToggleScope(
    () => closeOnClickOutside && context.isOpen.value,
    () => {
      useClickOutside(
        () => contentRef.value?.element,
        () => context.close(),
      )
    },
  )

  useToggleScope(
    () => closeOnEscape && context.isOpen.value,
    () => {
      useHotkey('escape', () => {
        if (ticket.globalTop.value) {
          context.close()
        }
      })
    },
  )

  const target = toRef(() => {
    const resolvedTo = to ?? stack.default.value ?? 'body'
    return resolvedTo === 'top-layer' ? stack.topElement.value ?? 'body' : resolvedTo
  })

  const slotProps = toRef((): OverlayPanelContentSlotProps => ({
    isOpen: context.isOpen.value,
    globalTop: ticket.globalTop.value,
    zIndex: ticket.zIndex.value,
    attrs: {
      'id': context.id,
      'role': 'dialog',
      'aria-modal': 'false',
      'style': { zIndex: ticket.zIndex.value, position: 'fixed' },
    },
  }))
</script>

<template>
  <Teleport :disabled :to="target">
    <Atom
      v-if="context.isOpen.value"
      ref="content"
      :as
      :renderless
      v-bind="mergeProps(attrs, slotProps.attrs)"
    >
      <slot v-bind="slotProps" />
    </Atom>
  </Teleport>
</template>
