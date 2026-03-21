/**
 * @module SnackbarRoot
 *
 * @remarks
 * A single snackbar instance. Provides dismiss context for Snackbar.Close.
 * Set ARIA role directly: role="alert" for urgent, role="status" for informational.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { SnackbarQueueContext } from './SnackbarQueue.vue'

  export interface SnackbarRootContext {
    id: ID
    onDismiss: () => void
  }

  export const [useSnackbarRootContext, provideSnackbarRootContext] =
    createContext<SnackbarRootContext>('v0:snackbar:root', { id: '', onDismiss: () => {} })

  export interface SnackbarRootProps extends AtomProps {
    /** Unique identifier. Auto-generated if not provided. */
    id?: ID
  }

  export interface SnackbarRootSlotProps {
    id: ID
  }
</script>

<script setup lang="ts">
  // Utilities
  import { useId } from '#v0/utilities'
  import { inject, toRef } from 'vue'

  defineOptions({ name: 'SnackbarRoot' })

  const emit = defineEmits<{
    dismiss: [id: ID]
  }>()

  defineSlots<{
    default: (props: SnackbarRootSlotProps) => any
  }>()

  const { as = 'div', id = useId() } = defineProps<SnackbarRootProps>()

  // Optionally detect Queue context — null when used standalone
  const queueContext = inject<SnackbarQueueContext | null>('v0:snackbar:queue', null)

  function onDismiss () {
    if (queueContext) {
      queueContext.dismiss(id)
    } else {
      emit('dismiss', id)
    }
  }

  provideSnackbarRootContext({ id, onDismiss })

  const slotProps = toRef((): SnackbarRootSlotProps => ({ id }))
</script>

<template>
  <Atom :as>
    <slot v-bind="slotProps" />
  </Atom>
</template>
