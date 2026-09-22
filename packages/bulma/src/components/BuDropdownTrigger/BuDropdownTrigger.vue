/**
 * @module BuDropdownTrigger
 *
 * @remarks
 * Bulma `.dropdown-trigger` — wraps the userland button or link. The trigger
 * element itself stays userland (Bulma documents both), so the aria wiring
 * v0's Toggle cannot supply (`aria-haspopup`, `aria-controls`,
 * `aria-expanded`) is handed to the default slot to bind.
 */

<script lang="ts">
  // Utilities
  import { orphan } from '../../utilities/context'
  import { toRef } from 'vue'

  // Context
  import { useBuDropdown } from '../BuDropdown/BuDropdown.vue'

  export interface BuDropdownTriggerAttrs {
    'aria-haspopup': 'true'
    'aria-controls': string
    'aria-expanded': 'true' | 'false'
    'onClick': () => void
  }

  export interface BuDropdownTriggerSlotProps {
    /** Whether the dropdown is open. */
    isOpen: boolean
    /** Toggle the dropdown (no-op when the parent is `hoverable`). */
    toggle: () => void
    /** Attributes to bind to the trigger element. */
    attrs: BuDropdownTriggerAttrs
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuDropdownTrigger' })

  defineSlots<{
    default?: (props: BuDropdownTriggerSlotProps) => any
  }>()

  const dropdown = useBuDropdown()

  orphan('BuDropdownTrigger', 'BuDropdown', dropdown)

  function toggle () {
    dropdown?.toggle()
  }

  const slotProps = toRef((): BuDropdownTriggerSlotProps => ({
    isOpen: dropdown?.isOpen() ?? false,
    toggle,
    attrs: {
      'aria-haspopup': 'true',
      'aria-controls': dropdown?.id ?? '',
      'aria-expanded': dropdown?.isOpen() ? 'true' : 'false',
      'onClick': toggle,
    },
  }))
</script>

<template>
  <div class="dropdown-trigger">
    <slot v-bind="slotProps" />
  </div>
</template>
