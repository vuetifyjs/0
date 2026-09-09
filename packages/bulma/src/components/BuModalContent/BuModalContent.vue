/**
 * @module BuModalContent
 *
 * @remarks
 * Bulma `.modal-content` — the panel of the plain variant. Carries the dialog
 * identity (`id`, `role`, `aria-modal`) and registers itself with BuModal's
 * focus trap. Pair it with BuModalClose for the documented `.modal-close`
 * button that sits beside it inside `.modal`.
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
  defineOptions({ name: 'BuModalContent' })

  defineSlots<{
    /** `.modal-content` body. */
    default?: () => any
  }>()

  const modal = useBuModal()
  const dialog = useDialogContext('v0:dialog', null as unknown as DialogContext) as DialogContext | null

  orphan('BuModalContent', 'BuModal', modal)

  function onPanel (el: unknown) {
    modal?.panel(el as HTMLElement | null)
  }
</script>

<template>
  <div
    :id="dialog?.id"
    :ref="onPanel"
    aria-modal="true"
    class="modal-content"
    role="dialog"
    tabindex="-1"
  >
    <slot />
  </div>
</template>
