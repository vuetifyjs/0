/**
 * @module BuModalTitle
 *
 * @remarks
 * Bulma `.modal-card-title` — rendered through v0's `Dialog.Title` so its id
 * matches the `aria-labelledby` BuModalCard binds. Omitting it leaves that
 * reference dangling (see SPEC.md "Known limitations").
 */

<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuModalTitle' })

  defineSlots<{
    /** Title text. */
    default?: () => any
  }>()
</script>

<template>
  <Dialog.Title
    as="p"
    class="modal-card-title"
  >
    <slot />
  </Dialog.Title>
</template>
