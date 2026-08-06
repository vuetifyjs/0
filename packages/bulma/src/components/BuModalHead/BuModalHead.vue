/**
 * @module BuModalHead
 *
 * @remarks
 * Bulma `.modal-card-head` — holds BuModalTitle and always renders the
 * documented `.delete` button, wired to close through v0's `Dialog.Close`
 * (which supplies the localized `aria-label` and keyboard handling).
 */

<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'

  // Context
  import { useBuModal } from '../BuModal/BuModal.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuModalHead' })

  defineSlots<{
    /** Head content — typically BuModalTitle. */
    default?: () => any
  }>()

  const modal = useBuModal()

  orphan('BuModalHead', 'BuModal', modal)
</script>

<template>
  <header class="modal-card-head">
    <slot />

    <Dialog.Close class="delete" />
  </header>
</template>
