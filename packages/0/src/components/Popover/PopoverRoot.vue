/**
 * @module PopoverRoot
 *
 * @see https://0.vuetifyjs.com/components/disclosure/popover
 *
 * @remarks
 * Root component for popover contexts. Creates and provides popover context
 * to child PopoverActivator and PopoverContent components. Manages open/closed
 * state via v-model binding.
 */

<script lang="ts">
  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { PopoverAdapter, PopoverReturn } from '#v0/composables/usePopover'

  export type PopoverContext = PopoverReturn

  export interface PopoverRootProps extends AtomProps {
    /** Unique identifier for the popover (auto-generated if not provided) */
    id?: string
    /** CSS position-area value for anchor positioning */
    positionArea?: string
    /** CSS position-try-fallbacks value for overflow */
    positionTry?: string
    /** Positioning engine. @default CSS anchor positioning (`V0PopoverAdapter`) */
    adapter?: PopoverAdapter
  }

  export interface PopoverRootSlotProps {
    /** Unique identifier */
    id: string
    /** Whether the popover is currently open */
    isSelected: boolean
    /** Toggle the popover open/closed state */
    toggle: () => void
  }

  export const [usePopoverContext, providePopoverContext] = createContext<PopoverContext>('v0:popover')
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { usePopover } from '#v0/composables/usePopover'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'PopoverRoot' })

  defineSlots<{
    default: (props: PopoverRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const { as = null, id: _id, adapter, positionArea, positionTry } = defineProps<PopoverRootProps>()

  const isSelected = defineModel<boolean>({ default: false })

  const popover = usePopover({
    id: _id,
    isOpen: isSelected,
    adapter,
    positionArea: () => positionArea,
    positionTry: () => positionTry,
  })

  providePopoverContext(popover)

  const slotProps = toRef((): PopoverRootSlotProps => ({
    id: popover.id,
    isSelected: isSelected.value,
    toggle: popover.toggle,
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
