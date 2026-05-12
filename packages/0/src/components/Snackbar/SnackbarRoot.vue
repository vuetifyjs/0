/**
 * @module SnackbarRoot
 *
 * @see https://0.vuetifyjs.com/components/semantic/snackbar
 *
 * @remarks
 * A single snackbar instance. Provides dismiss context for Snackbar.Close.
 * Set ARIA role directly: role="alert" for urgent, role="status" for informational.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useSnackbarQueueContext } from './SnackbarQueue.vue'

  // Composables
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { useId } from '#v0/utilities'
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface SnackbarRootContext {
    id: ID
    onDismiss: () => void
  }

  export const [useSnackbarRootContext, provideSnackbarRootContext] =
    createContext<SnackbarRootContext>({ suffix: 'root' })

  export interface SnackbarRootProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:notifications' */
    namespace?: string
    /** Unique identifier. Auto-generated if not provided. */
    id?: ID
  }

  export interface SnackbarRootSlotProps {
    id: ID
    attrs: {
      role: string
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SnackbarRoot' })

  const emit = defineEmits<{
    dismiss: [id: ID]
  }>()

  defineSlots<{
    default: (props: SnackbarRootSlotProps) => any
  }>()

  const { as = 'div', namespace = 'v0:notifications', id = useId() } = defineProps<SnackbarRootProps>()

  const queue = useSnackbarQueueContext(namespace, null)

  function onDismiss () {
    if (queue) {
      queue.dismiss(id)
    } else {
      emit('dismiss', id)
    }
  }

  provideSnackbarRootContext(namespace, { id, onDismiss })

  const slotProps = toRef((): SnackbarRootSlotProps => ({
    id,
    attrs: {
      role: 'status',
    },
  }))
</script>

<template>
  <Atom v-bind="slotProps.attrs" :as>
    <slot v-bind="slotProps" />
  </Atom>
</template>
