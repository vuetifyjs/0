/**
 * @module PopoverActivator
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
      'data-popover-open': '' | undefined
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

  const { as = 'button', ...props } = defineProps<PopoverActivatorProps>()

  const context = usePopoverContext()

  const popovertarget = toRef(() => props.target ?? context.id)

  const style = toRef(() => ({
    anchorName: `--${toValue(popovertarget)}`,
  }))

  const slotProps = toRef((): PopoverActivatorSlotProps => ({
    isOpen: context.isSelected.value,
    attrs: {
      'popovertarget': toValue(popovertarget),
      'type': as === 'button' ? 'button' : undefined,
      'data-popover-open': context.isSelected.value ? '' : undefined,
    },
  }))
</script>

<template>
  <Atom
    :as
    :style
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
