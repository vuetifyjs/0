/**
 * @module BuFieldBody
 *
 * @remarks
 * Bulma `.field-body` — the control column of a horizontal field. Holds one
 * or more nested BuFields.
 */

<script setup lang="ts">
  defineOptions({ name: 'BuFieldBody' })

  defineSlots<{
    /** Control column content — nested BuFields. */
    default?: () => any
  }>()
</script>

<template>
  <div class="field-body">
    <slot />
  </div>
</template>
