/**
 * @module BuModalHead
 *
 * @remarks
 * Bulma `.modal-card-head` — title and optional BuModalDelete. Pure markup;
 * a head without Delete is a valid title-only card head.
 */

<script setup lang="ts">
  defineOptions({ name: 'BuModalHead' })

  defineSlots<{
    /** Head content — typically BuModalTitle and optional BuModalDelete. */
    default?: () => any
  }>()
</script>

<template>
  <header class="modal-card-head">
    <slot />
  </header>
</template>
