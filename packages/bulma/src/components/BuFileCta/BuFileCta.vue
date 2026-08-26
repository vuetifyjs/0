/**
 * @module BuFileCta
 *
 * @remarks
 * Bulma `span.file-cta` — hosts BuFileIcon and the inner `span.file-label`
 * CTA text. The inner label is the class collision Bulma ships; compose it
 * as a span, not a part.
 */

<script setup lang="ts">
  defineOptions({ name: 'BuFileCta' })

  defineSlots<{
    /** Icon plus `span.file-label` CTA text */
    default?: () => any
  }>()
</script>

<template>
  <span class="file-cta">
    <slot />
  </span>
</template>
