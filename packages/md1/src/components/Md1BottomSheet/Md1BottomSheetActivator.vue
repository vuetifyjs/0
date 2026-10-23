<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Context
  import { orphan, useMd1BottomSheet } from './context'

  // Utilities
  import { toRef } from 'vue'

  export interface Md1BottomSheetActivatorSlotProps {
    /** Whether the sheet is open. */
    isOpen: boolean
    /**
     * Spread onto the trigger. Modal: `type`, `tabindex`, `aria-haspopup="dialog"`,
     * `aria-expanded`, `data-open` and the `click` that opens. Persistent:
     * `type`, `aria-expanded`, `aria-controls`, `data-open` and the `click`
     * that toggles the sheet.
     */
    attrs: Record<string, unknown>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1BottomSheetActivator' })

  defineSlots<{
    /** The trigger. Spread `attrs` onto it; an `Md1Button` is the usual host. */
    default?: (props: Md1BottomSheetActivatorSlotProps) => any
  }>()

  const context = useMd1BottomSheet()

  orphan('Md1BottomSheetActivator', context)

  const modal = toRef(() => !!context && !context.persistent.value)
  const isOpen = toRef(() => context?.isOpen.value ?? false)

  function onClick () {
    context?.toggle()
  }

  // A persistent sheet is a non-modal region, not a dialog: the trigger is a
  // disclosure button that controls it.
  const attrs = toRef((): Record<string, unknown> => ({
    'type': 'button',
    'aria-expanded': isOpen.value,
    'aria-controls': isOpen.value ? context?.id.value : undefined,
    'data-open': isOpen.value || undefined,
    'onClick': onClick,
  }))
</script>

<!--
  Renderless on purpose: the trigger is the consumer's Md1Button, and a button
  rendered around another button is invalid markup with two click targets.
-->
<template>
  <Dialog.Activator v-if="modal" v-slot="slotProps" renderless>
    <slot :attrs="{ ...slotProps.attrs }" :is-open="slotProps.isOpen" />
  </Dialog.Activator>

  <slot v-else :attrs :is-open />
</template>
