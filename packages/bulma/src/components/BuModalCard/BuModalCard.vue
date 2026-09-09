/**
 * @module BuModalCard
 *
 * @remarks
 * Bulma `.modal-card` — the panel of the card variant. Carries the dialog
 * identity (`id`, `role`, `aria-modal`, `aria-labelledby`) that v0's
 * `Dialog.Content` would own if BuModal were not renderless, and registers
 * itself with BuModal's focus trap.
 */

<script lang="ts">
  // Framework
  import { useDialogContext } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'

  // Types
  import type { DialogContext } from '@vuetify/v0'

  // Context
  import { useBuModal } from '../BuModal/BuModal.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuModalCard' })

  defineSlots<{
    /** `.modal-card` children — BuModalHead, BuModalBody, BuModalFoot. */
    default?: () => any
  }>()

  const modal = useBuModal()
  const dialog = useDialogContext('v0:dialog', null as unknown as DialogContext) as DialogContext | null

  orphan('BuModalCard', 'BuModal', modal)

  function onPanel (el: unknown) {
    modal?.panel(el as HTMLElement | null)
  }
</script>

<template>
  <div
    :id="dialog?.id"
    :ref="onPanel"
    :aria-labelledby="dialog?.titleId"
    aria-modal="true"
    class="modal-card"
    role="dialog"
    tabindex="-1"
  >
    <slot />
  </div>
</template>
