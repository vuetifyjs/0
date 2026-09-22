/**
 * @module BuTabList
 *
 * @remarks
 * Bulma `.tabs` — the block itself plus the `ul` it always wraps. Carries
 * every `.tabs` modifier; the tab panels are siblings of it inside BuTabs.
 */

<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BuTabListProps {
    /** Centers the tab list */
    centered?: boolean
    /** Boxed (bordered) tab style */
    boxed?: boolean
    /** Mutually-exclusive toggle button style */
    toggle?: boolean
    /** Size modifier */
    size?: 'small' | 'normal' | 'medium' | 'large'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuTabList' })

  defineSlots<{
    /** BuTab items — rendered inside the `<ul>`. */
    default: () => any
  }>()

  const {
    centered = false,
    boxed = false,
    toggle = false,
    size,
  } = defineProps<BuTabListProps>()

  const classes = toRef(() => [
    size && `is-${size}`,
    centered && 'is-centered',
    boxed && 'is-boxed',
    toggle && 'is-toggle',
  ])
</script>

<template>
  <div class="tabs" :class="classes">
    <Tabs.List as="ul">
      <slot />
    </Tabs.List>
  </div>
</template>
