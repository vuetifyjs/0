/**
 * @module BuMessageDelete
 *
 * @remarks
 * Bulma `button.delete` inside `.message-header`. Calls `close()` on
 * `bulma:message`. Header without this part is a valid title-only header.
 */

<script lang="ts">
  // Utilities
  import { orphan } from '../../utilities/context'

  // Context
  import { useBuMessage } from '../BuMessage/BuMessage.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuMessageDelete' })

  const message = useBuMessage()

  orphan('BuMessageDelete', 'BuMessage', message)

  function onDelete () {
    message?.close()
  }
</script>

<template>
  <button
    aria-label="delete"
    class="delete"
    type="button"
    @click="onDelete"
  />
</template>
