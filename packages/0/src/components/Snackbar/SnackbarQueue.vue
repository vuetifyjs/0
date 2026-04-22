/**
 * @module SnackbarQueue
 *
 * @see https://0.vuetifyjs.com/components/semantic/snackbar
 *
 * @remarks
 * Connects to useNotifications and exposes queue items via slot.
 * Provides dismiss context consumed by Snackbar.Root/Close.
 * Pauses the queue on mouseenter/focusin, resumes on mouseleave/focusout.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  // Foundational
  import { createContext } from '#v0/composables/createContext'
  import { useNotifications } from '#v0/composables/useNotifications'

  // Utilities
  import { isElement, isUndefined } from '#v0/utilities'
  import { computed, onBeforeUnmount, toRef, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { NotificationTicket } from '#v0/composables/useNotifications'
  import type { ID } from '#v0/types'

  export interface SnackbarQueueContext {
    dismiss: (id: ID) => void
  }

  export const [useSnackbarQueueContext, provideSnackbarQueueContext] =
    createContext<SnackbarQueueContext | null>({ suffix: 'queue' })

  export interface SnackbarQueueProps extends AtomProps {
    /** Which notifications instance to connect to. @default 'v0:notifications' */
    namespace?: string
  }

  export interface SnackbarQueueSlotProps {
    items: NotificationTicket[]
    attrs: {
      onMouseenter: () => void
      onMouseleave: () => void
      onFocusin: () => void
      onFocusout: (e: FocusEvent) => void
    }
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
    if (reasons.size > 0) notifications.queue.pause()
  }

  provideSnackbarQueueContext(namespace, { dismiss })

  // Newest first — visual ordering decoupled from FIFO dismissal order
  const items = computed((): NotificationTicket[] =>
    notifications.queue.values()
      .map(q => notifications.get(q.id))
      .filter((n): n is NotificationTicket => !isUndefined(n))
      .toReversed(),
  )

  const container = useTemplateRef<AtomExpose>('container')
  const reasons = new Set<string>()

  function pause (reason: string) {
    reasons.add(reason)
    notifications.queue.pause()
  }

  function resume (reason: string) {
    reasons.delete(reason)
    if (reasons.size === 0) notifications.queue.resume()
  }

  function onEnter () {
    pause('hover')
  }
  function onLeave () {
    resume('hover')
  }
  function onFocusin () {
    pause('focus')
  }

  function onFocusout (e: FocusEvent) {
    const el = container.value?.element ?? null
    if (isElement(el) && isElement(e.relatedTarget) && el.contains(e.relatedTarget)) return
    resume('focus')
  }

  onBeforeUnmount(() => {
    if (reasons.size > 0) {
      reasons.clear()
      notifications.queue.resume()
    }
  })

  const slotProps = toRef((): SnackbarQueueSlotProps => ({
    items: items.value,
    attrs: {
      onMouseenter: onEnter,
      onMouseleave: onLeave,
      onFocusin: onFocusin,
      onFocusout: onFocusout,
    },
  }))
</script>

<template>
  <Atom
    ref="container"
    v-bind="slotProps.attrs"
    :as
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
