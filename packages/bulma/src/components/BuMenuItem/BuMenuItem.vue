/**
 * @module BuMenuItem
 *
 * @remarks
 * Bulma menu `li` — hosts a BuMenuLink and an optional nested BuMenuList.
 */

<script setup lang="ts">
  defineOptions({ name: 'BuMenuItem' })

  defineSlots<{
    /** BuMenuLink plus optional nested BuMenuList */
    default?: () => any
  }>()
</script>

<template>
  <li>
    <slot />
  </li>
</template>
