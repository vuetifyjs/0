/**
 * @module BuModalDelete
 *
 * @remarks
 * Bulma `.delete` inside `.modal-card-head` — the card-head X, rendered
 * through v0's `Dialog.Close`. Not `BuModalClose` (that's `.modal-close`).
 * Head without this part is a valid title-only card head.
 */

<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuModalDelete' })
</script>

<template>
  <Dialog.Close class="delete" />
</template>
