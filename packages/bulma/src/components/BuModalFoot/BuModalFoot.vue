/**
 * @module BuModalFoot
 *
 * @remarks
 * Bulma `.modal-card-foot` — the action row of the card variant. Pure markup;
 * it holds no modal state.
 */

<script setup lang="ts">
  defineOptions({ name: 'BuModalFoot' })

  defineSlots<{
    /** Footer content — typically a `.buttons` group. */
    default?: () => any
  }>()
</script>

<template>
  <footer class="modal-card-foot">
    <slot />
  </footer>
</template>
