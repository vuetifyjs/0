/**
 * @module BuDropdownMenu
 *
 * @remarks
 * Bulma `.dropdown-menu` + `.dropdown-content` — the pair always ships
 * together in the documented markup, so this part renders both. `role="menu"`
 * appears only when the parent BuDropdown was told its items are actionable
 * (`menu`); the slot hands each item the matching `role="menuitem"`.
 */

<script lang="ts">
  // Utilities
  import { orphan } from '../../utilities/context'
  import { toRef } from 'vue'

  // Context
  import { useBuDropdown } from '../BuDropdown/BuDropdown.vue'

  export interface BuDropdownMenuSlotProps {
    /** Whether the dropdown is open. */
    isOpen: boolean
    /** Close the dropdown. */
    close: () => void
    /** Attrs to bind to each actionable item when the parent sets `menu`; empty otherwise. */
    item: { role?: 'menuitem' }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuDropdownMenu' })

  defineSlots<{
    default?: (props: BuDropdownMenuSlotProps) => any
  }>()

  const dropdown = useBuDropdown()

  orphan('BuDropdownMenu', 'BuDropdown', dropdown)

  function close () {
    dropdown?.close()
  }

  const slotProps = toRef((): BuDropdownMenuSlotProps => ({
    isOpen: dropdown?.isOpen() ?? false,
    close,
    item: dropdown?.isMenu() ? { role: 'menuitem' } : {},
  }))
</script>

<template>
  <div
    :id="dropdown?.id"
    class="dropdown-menu"
    :role="dropdown?.isMenu() ? 'menu' : undefined"
  >
    <div class="dropdown-content">
      <slot v-bind="slotProps" />
    </div>
  </div>
</template>
