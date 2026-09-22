/**
 * @module BuNavbarMenu
 *
 * @remarks
 * Bulma `.navbar-menu` — the region the burger expands. `is-active` is the
 * only display mechanism (never the `hidden` attribute: `.navbar-menu.is-active`
 * author CSS silently beats it). `.navbar-start` / `.navbar-end` markup is
 * userland, as is the hover-driven `.navbar-dropdown` — pure Bulma CSS.
 */

<script lang="ts">
  // Utilities
  import { orphan } from '../../utilities/context'
  import { toRef } from 'vue'

  // Context
  import { useBuNavbar } from '../BuNavbar/BuNavbar.vue'

  export interface BuNavbarMenuSlotProps {
    /** Whether the mobile menu is open */
    isOpen: boolean
    /** Toggle the mobile menu */
    toggle: () => void
    /** Close the mobile menu */
    close: () => void
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuNavbarMenu' })

  defineSlots<{
    default?: (props: BuNavbarMenuSlotProps) => any
  }>()

  const navbar = useBuNavbar()

  orphan('BuNavbarMenu', 'BuNavbar', navbar)

  function toggle () {
    navbar?.toggle()
  }

  function close () {
    navbar?.close()
  }

  const slotProps = toRef((): BuNavbarMenuSlotProps => ({
    isOpen: navbar?.isOpen() ?? false,
    toggle,
    close,
  }))
</script>

<template>
  <div
    :id="navbar?.id()"
    class="navbar-menu"
    :class="{ 'is-active': slotProps.isOpen }"
  >
    <slot v-bind="slotProps" />
  </div>
</template>
