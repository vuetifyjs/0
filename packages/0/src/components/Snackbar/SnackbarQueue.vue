/**
 * @module SnackbarQueue
 *
 * @remarks
 * Connects to useNotifications and exposes queue items via slot.
 * Provides dismiss context consumed by Snackbar.Root/Close.
 * Pauses the queue on mouseenter, resumes on mouseleave.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Composables
  import { useNotifications } from '#v0/composables/useNotifications'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { computed, toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { NotificationTicket } from '#v0/composables/useNotifications'
  import type { ID } from '#v0/types'

  export interface SnackbarQueueContext {
    dismiss: (id: ID) => void
  }

  export const [useSnackbarQueueContext, provideSnackbarQueueContext] =
    createContext<SnackbarQueueContext>('v0:snackbar:queue')

  export interface SnackbarQueueProps extends AtomProps {
    /** Which notifications instance to connect to. @default 'v0:notifications' */
    namespace?: string
  }

  export interface SnackbarQueueSlotProps {
    items: NotificationTicket[]
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SnackbarQueue' })

  defineSlots<{
    default: (props: SnackbarQueueSlotProps) => any
  }>()

  const { as = 'div', namespace = 'v0:notifications' } = defineProps<SnackbarQueueProps>()

  const notifications = useNotifications(namespace)

  // Full removal: removes from registry (cascades to queue)
  function dismiss (id: ID) {
    notifications.unregister(id)
  }

  provideSnackbarQueueContext({ dismiss })

  // Newest first — visual ordering decoupled from FIFO dismissal order
  const items = computed((): NotificationTicket[] =>
    notifications.queue.values()
      .map(q => notifications.get(q.id))
      .filter((n): n is NotificationTicket => !isUndefined(n))
      .toReversed(),
  )

  function onEnter () {
    notifications.queue.pause()
  }

  function onLeave () {
    notifications.queue.resume()
  }

  const slotProps = toRef((): SnackbarQueueSlotProps => ({ items: items.value }))
</script>

<template>
  <Atom
    :as
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
