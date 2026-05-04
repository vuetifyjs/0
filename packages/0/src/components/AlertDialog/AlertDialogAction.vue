/**
 * @module AlertDialogAction
 *
 * @see https://0.vuetifyjs.com/components/disclosure/alert-dialog
 *
 * @remarks
 * Confirm button for alert dialogs with deferred close support.
 * Emits an `action` event with `wait()`/`close()` control:
 *
 * - If `wait()` is never called, the dialog closes immediately on click
 * - If `wait()` is called, the dialog stays open until `close()` is called
 * - Tracks `isPending` state between `wait()` and `close()`
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertDialogActionEvent {
    /** Signal the dialog to stay open until close() is called */
    wait: () => void
    /** Resolve the pending state and close the dialog */
    close: () => void
  }

  export interface AlertDialogActionProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Whether the action button is disabled */
    disabled?: boolean
  }

  export interface AlertDialogActionEmits {
    action: [event: AlertDialogActionEvent]
  }

  export interface AlertDialogActionSlotProps {
    /** Whether the action is pending (between wait and close) */
    isPending: boolean
    /** Attributes to bind to the action button element */
    attrs: {
      'type': 'button' | undefined
      'disabled': boolean | undefined
      'data-disabled': '' | undefined
      'data-pending': '' | undefined
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useAlertDialogContext } from './AlertDialogRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'AlertDialogAction' })

  defineSlots<{
    default: (props: AlertDialogActionSlotProps) => any
  }>()

  const {
    as = 'button',
    namespace = 'v0:alert-dialog',
    disabled = false,
  } = defineProps<AlertDialogActionProps>()

  const emit = defineEmits<AlertDialogActionEmits>()

  const context = useAlertDialogContext(namespace)

  function onClick () {
    if (disabled) return

    let waited = false

    const event: AlertDialogActionEvent = {
      wait () {
        waited = true
        context.isPending.value = true
      },
      close () {
        context.isPending.value = false
        context.close()
      },
    }

    emit('action', event)

    if (!waited) {
      context.close()
    }
  }

  const slotProps = toRef((): AlertDialogActionSlotProps => ({
    isPending: context.isPending.value,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'disabled': disabled || undefined,
      'data-disabled': disabled ? '' : undefined,
      'data-pending': context.isPending.value ? '' : undefined,
    },
  }))
</script>

<template>
  <Atom
    :as
    v-bind="slotProps.attrs"
    @click="onClick"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
