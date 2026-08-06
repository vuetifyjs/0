/**
 * @module BuPanelHeading
 *
 * @remarks
 * Bulma `p.panel-heading` — the panel's title bar. Pure markup.
 */

<script setup lang="ts">
  defineOptions({ name: 'BuPanelHeading' })

  defineSlots<{
    /** Heading text. */
    default?: () => any
  }>()
</script>

<template>
  <p class="panel-heading">
    <slot />
  </p>
</template>
