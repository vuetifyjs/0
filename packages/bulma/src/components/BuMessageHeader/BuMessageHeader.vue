/**
 * @module BuMessageHeader
 *
 * @remarks
 * Bulma `.message-header` — always renders the documented `.delete` button,
 * wired to BuMessage's model through the `bulma:message` context. Rendering
 * the header is what opts a message into being dismissible, exactly as in
 * Bulma's own markup.
 */

<script lang="ts">
  // Utilities
  import { orphan } from '../../utilities/context'

  // Context
  import { useBuMessage } from '../BuMessage/BuMessage.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuMessageHeader' })

  defineSlots<{
    /** Header content — Bulma wraps its own in a `<p>`. */
    default?: () => any
  }>()

  const message = useBuMessage()

  orphan('BuMessageHeader', 'BuMessage', message)

  function onDelete () {
    message?.close()
  }
</script>

<template>
  <div class="message-header">
    <slot />

    <button
      aria-label="delete"
      class="delete"
      type="button"
      @click="onDelete"
    />
  </div>
</template>
