/**
 * @module BuNotificationDelete
 *
 * @remarks
 * Bulma `button.delete` as the first child of `.notification`. Calls
 * `close()` on `bulma:notification`. Notification without this part is a
 * valid box. `aria-label="delete"` is a declared a11y addition — upstream
 * ships the button unlabeled.
 */

<script lang="ts">
  // Utilities
  import { orphan } from '../../utilities/context'

  // Context
  import { useBuNotification } from '../BuNotification/BuNotification.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuNotificationDelete' })

  const notification = useBuNotification()

  orphan('BuNotificationDelete', 'BuNotification', notification)

  function onDelete () {
    notification?.close()
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
