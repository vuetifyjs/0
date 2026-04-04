/**
 * @module AlertDialogRoot
 *
 * @remarks
 * Root component for alert dialog contexts. Creates and provides alert dialog
 * context to child AlertDialog components. Manages open/closed state via v-model
 * binding and tracks pending state for deferred close actions.
 */

<script lang="ts">
  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ShallowRef } from 'vue'

  export interface AlertDialogContext {
    isOpen: ShallowRef<boolean>
    id: string
    titleId: string
    descriptionId: string
    isPending: ShallowRef<boolean>
    open: () => void
    close: () => void
  }

  export interface AlertDialogRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Unique identifier for the alert dialog (auto-generated if not provided) */
    id?: string
  }

  export interface AlertDialogRootSlotProps {
    /** Unique identifier */
    id: string
    /** Whether the alert dialog is currently open */
    isOpen: boolean
    /** Whether an action is pending (between wait and close) */
    isPending: boolean
    /** Open the alert dialog */
    open: () => void
    /** Close the alert dialog */
    close: () => void
  }

  export const [useAlertDialogContext, provideAlertDialogContext] = createContext<AlertDialogContext>()
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { shallowRef, toRef, useId } from 'vue'

  defineOptions({ name: 'AlertDialogRoot' })

  defineSlots<{
    default: (props: AlertDialogRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    as = null,
    namespace = 'v0:alert-dialog',
    id: _id,
  } = defineProps<AlertDialogRootProps>()

  const id = _id ?? useId()

  const isOpen = defineModel<boolean>({ default: false })
  const isPending = shallowRef(false)

  const titleId = `${id}-title`
  const descriptionId = `${id}-description`

  function open () {
    isOpen.value = true
  }

  function close () {
    isPending.value = false
    isOpen.value = false
  }

  provideAlertDialogContext(namespace, {
    isOpen,
    id,
    titleId,
    descriptionId,
    isPending,
    open,
    close,
  })

  const slotProps = toRef((): AlertDialogRootSlotProps => ({
    id,
    isOpen: isOpen.value,
    isPending: isPending.value,
    open,
    close,
  }))
</script>

<template>
  <Atom
    :as
    renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
