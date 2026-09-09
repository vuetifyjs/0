/**
 * @module BuFileIcon
 *
 * @remarks
 * Bulma `span.file-icon` — the glyph wrapper. Default slot is the `i`.
 */

<script setup lang="ts">
  defineOptions({ name: 'BuFileIcon' })

  defineSlots<{
    /** The `i` glyph */
    default?: () => any
  }>()
</script>

<template>
  <span class="file-icon">
    <slot />
  </span>
</template>
