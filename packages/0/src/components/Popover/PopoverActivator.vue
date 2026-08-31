/**
 * @module PopoverActivator
 *
 * @see https://0.vuetifyjs.com/components/disclosure/popover
 *
 * @remarks
 * Activator/trigger component for popovers. Provides the element that triggers
 * the popover content to show/hide. Uses the native popover API via popovertarget.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { usePopoverContext } from './PopoverRoot.vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { toRef, toValue, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface PopoverActivatorProps extends AtomProps {
    /** Target popover ID (defaults to parent PopoverRoot id) */
    target?: string
  }

  export interface PopoverActivatorSlotProps {
    /** Whether the popover is currently open */
    isOpen: boolean
    /** Attributes to bind to the anchor element */
    attrs: {
      'popovertarget': string
      'type': 'button' | undefined
      'role': 'button' | undefined
      'tabindex': number
      'aria-expanded': boolean
      'aria-controls': string
      'data-open': true | undefined
      'style': Record<string, string>
      'onKeydown': ((e: KeyboardEvent) => void) | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'PopoverActivator' })

  defineSlots<{
    default: (props: PopoverActivatorSlotProps) => any
  }>()

  const { as = 'button', renderless, target } = defineProps<PopoverActivatorProps>()

  const context = usePopoverContext()

  const atomRef = useTemplateRef<AtomExpose>('atom')

  // Only the default target (the parent PopoverRoot's own popover) has a
  // positioning-adapter context to register with - a custom `target` points
  // at a different, unrelated popover instance's context.
  if (!target) {
    context.attachAnchor(() => toElement(atomRef.value?.element) ?? null)
  }

  const popovertarget = toRef(() => target ?? context.id)

  const style = toRef(() => {
    if (target) {
      return { anchorName: `--${String(target).replace(/[^a-zA-Z0-9_-]/g, '')}` }
    }
    return context.anchorStyles.value
  })

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      context.toggle()
    }
  }

  const slotProps = toRef((): PopoverActivatorSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'popovertarget': toValue(popovertarget),
      'type': as === 'button' ? 'button' : undefined,
      'role': as === 'button' ? undefined : 'button',
      'tabindex': 0,
      'aria-expanded': context.isOpen.value,
      'aria-controls': toValue(popovertarget),
      'data-open': context.isOpen.value || undefined,
      'style': style.value,
      'onKeydown': as === 'button' ? undefined : onKeydown,
    },
  }))
</script>

<template>
  <Atom
    ref="atom"
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
