/**
 * @module BuPaginationList
 *
 * @remarks
 * Bulma `ul.pagination-list` — hosts BuPaginationItem / BuPaginationEllipsis
 * children. Place after Prev and Next in the DOM; CSS flex-orders the list
 * between the anchors visually.
 */

<script setup lang="ts">
  defineOptions({ name: 'BuPaginationList' })

  defineSlots<{
    /** Page links and ellipses */
    default?: () => any
  }>()
</script>

<template>
  <ul class="pagination-list">
    <slot />
  </ul>
</template>
