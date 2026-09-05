/**
 * @module BuMenuLabel
 *
 * @remarks
 * Bulma `p.menu-label` — section heading above a BuMenuList. Pure markup.
 */

<script setup lang="ts">
  defineOptions({ name: 'BuMenuLabel' })

  defineSlots<{
    /** Heading text */
    default?: () => any
  }>()
</script>

<template>
  <p class="menu-label">
    <slot />
  </p>
</template>
