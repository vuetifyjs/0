/**
 * @module BuNavbarBrand
 *
 * @remarks
 * Bulma `.navbar-brand` — brand items plus the `.navbar-burger` toggle Bulma
 * documents at the end of the brand row. The burger is v0's Toggle rendered
 * as the role=button anchor the docs ship, with `aria-expanded` and
 * `data-target` hand-bound from BuNavbar's context.
 */

<script lang="ts">
  // Framework
  import { Toggle } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'
  import { toRef } from 'vue'

  // Context
  import { useBuNavbar } from '../BuNavbar/BuNavbar.vue'

  export interface BuNavbarBrandProps {
    /** Renders the `.navbar-burger` toggle */
    burger?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuNavbarBrand' })

  defineSlots<{
    /** Brand content — `.navbar-item` links, logos. */
    default?: () => any
  }>()

  const { burger = true } = defineProps<BuNavbarBrandProps>()

  const navbar = useBuNavbar()

  orphan('BuNavbarBrand', 'BuNavbar', navbar)

  const isOpen = toRef(() => navbar?.isOpen() ?? false)

  function onToggle () {
    navbar?.toggle()
  }
</script>

<template>
  <div class="navbar-brand">
    <slot />

    <Toggle.Root
      v-if="burger"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-label="menu"
      as="a"
      class="navbar-burger"
      :class="{ 'is-active': isOpen }"
      :data-target="navbar?.id()"
      :model-value="isOpen"
      @update:model-value="onToggle"
    >
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
      <span aria-hidden="true" />
    </Toggle.Root>
  </div>
</template>
