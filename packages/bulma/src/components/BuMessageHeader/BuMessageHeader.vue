/**
 * @module BuMessageHeader
 *
 * @remarks
 * Bulma `.message-header` — title and optional BuMessageDelete. Pure markup;
 * a header without Delete is a valid title-only header.
 */

<script setup lang="ts">
  defineOptions({ name: 'BuMessageHeader' })

  defineSlots<{
    /** Header content — Bulma wraps its own in a `<p>`. */
    default?: () => any
  }>()
</script>

<template>
  <div class="message-header">
    <slot />
  </div>
</template>
