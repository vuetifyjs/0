/**
 * @module BuMessageBody
 *
 * @remarks
 * Bulma `.message-body` — the message text region. Pure markup; a body-only
 * message is Bulma's documented no-header variant.
 */

<script setup lang="ts">
  defineOptions({ name: 'BuMessageBody' })

  defineSlots<{
    /** Body content. */
    default?: () => any
  }>()
</script>

<template>
  <div class="message-body">
    <slot />
  </div>
</template>
