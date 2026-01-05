/**
 * @module PopoverRoot
 *
 * @remarks
 * Root component for popover contexts. Creates and provides popover context
 * to child PopoverActivator and PopoverContent components. Manages open/closed
 * state via v-model binding.
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ShallowRef } from 'vue'

  export interface PopoverContext {
    isSelected: ShallowRef<boolean>
    id: string
    toggle: () => void
  }

  export interface PopoverRootProps extends AtomProps {
    /** Unique identifier for the popover (auto-generated if not provided) */
    id?: string
  }

  export interface PopoverRootSlotProps {
    /** Unique identifier */
    id: string
    /** Whether the popover is currently open */
    isSelected: boolean
    /** Toggle the popover open/closed state */
    toggle: () => void
  }

  export const [usePopoverContext, providePopoverContext] = createContext<PopoverContext>('Popover')
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { toRef, toValue, useId } from 'vue'

  defineOptions({ name: 'PopoverRoot' })

  defineSlots<{
    default: (props: PopoverRootSlotProps) => any
  }>()

  const { as = null, ...props } = defineProps<PopoverRootProps>()

  const isSelected = defineModel<boolean>({ default: false })

  const id = toRef(() => props.id ?? useId())

  function toggle () {
    isSelected.value = !isSelected.value
  }

  providePopoverContext({
    isSelected,
    toggle,
    id: toValue(id),
  })

  const slotProps = toRef((): PopoverRootSlotProps => ({
    id: toValue(id),
    isSelected: isSelected.value,
    toggle,
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
