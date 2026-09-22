/**
 * @module BuModalBody
 *
 * @remarks
 * Bulma `.modal-card-body` — the scrollable region between BuModalHead and
 * BuModalFoot. Pure markup; it holds no modal state.
 */

<script setup lang="ts">
  defineOptions({ name: 'BuModalBody' })

  defineSlots<{
    /** Body content. */
    default?: () => any
  }>()
</script>

<template>
  <section class="modal-card-body">
    <slot />
  </section>
</template>
