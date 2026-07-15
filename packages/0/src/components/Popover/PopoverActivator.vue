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
  // Types
  import type { AtomProps } from '#v0/components/Atom'

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
      'aria-expanded': boolean
      'aria-controls': string
      'data-open': true | undefined
      'style': Record<string, string>
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { usePopoverContext } from './PopoverRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'PopoverActivator' })

  defineSlots<{
    default: (props: PopoverActivatorSlotProps) => any
  }>()

  const { as = 'button', renderless, target } = defineProps<PopoverActivatorProps>()

  const context = usePopoverContext()

  const popovertarget = toRef(() => target ?? context.id)

  const style = toRef(() => {
    if (target) {
      return { anchorName: `--${String(target).replace(/[^a-zA-Z0-9_-]/g, '')}` }
    }
    return context.anchorStyles.value
  })

  const slotProps = toRef((): PopoverActivatorSlotProps => ({
    isOpen: context.isOpen.value,
    attrs: {
      'popovertarget': toValue(popovertarget),
      'type': as === 'button' ? 'button' : undefined,
      'aria-expanded': context.isOpen.value,
      'aria-controls': toValue(popovertarget),
      'data-open': context.isOpen.value || undefined,
      'style': style.value,
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
