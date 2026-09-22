/**
 * @module BuMenuList
 *
 * @remarks
 * Bulma `ul.menu-list` for top-level lists. Nested lists omit `.menu-list`
 * (classless `ul`) when `nested` is set — that is what Bulma documents.
 */

<script lang="ts">
  export interface BuMenuListProps {
    /** Omit `.menu-list` — nested lists are a bare `<ul>` */
    nested?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuMenuList' })

  defineSlots<{
    /** BuMenuItem children */
    default?: () => any
  }>()

  const { nested = false } = defineProps<BuMenuListProps>()
</script>

<template>
  <ul :class="{ 'menu-list': !nested }">
    <slot />
  </ul>
</template>
