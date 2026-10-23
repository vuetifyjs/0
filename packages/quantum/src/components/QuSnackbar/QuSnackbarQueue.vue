<script lang="ts">
  // Framework
  import { createContext, isUndefined, Snackbar, useNotifications } from '@vuetify/v0'

  // Context
  import { orphan, QU_SNACKBAR_NAMESPACE, useQuSnackbarPortal } from './QuSnackbarPortal.vue'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { ID, NotificationTicket, SnackbarQueueProps } from '@vuetify/v0'
  import type { Ref } from 'vue'

  export interface QuSnackbarQueueContext {
    /** The ticket on screen; a `QuSnackbar` inside takes it as its id when given none. */
    id: Readonly<Ref<ID | undefined>>
    /** False while the shown snackbar contracts off screen to make way for the next one. */
    present: Readonly<Ref<boolean>>
    /** Called by the snackbar once its exit has finished: the next ticket, if any, enters. */
    settle: () => void
  }

  export interface QuSnackbarQueueProps extends Pick<SnackbarQueueProps, 'namespace'> {
    /**
     * Auto-dismiss in ms for a notification sent without its own `timeout`.
     * The guidelines give no duration; 6000 ms is Quantum's default (Vuetify
     * 1.5's). A `timeout` passed to `send()` still wins.
     */
    timeout?: number
  }

  export interface QuSnackbarQueueSlotProps {
    /** The one notification on screen. */
    item: NotificationTicket
  }

  const [useQuSnackbarQueue, provideQuSnackbarQueue] = createContext<QuSnackbarQueueContext | null>('quantum:snackbar-queue', null)

  export { useQuSnackbarQueue }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuSnackbarQueue' })

  defineSlots<{
    /** One `QuSnackbar` for the notification on screen. */
    default?: (props: QuSnackbarQueueSlotProps) => any
  }>()

  const { namespace: _namespace, timeout = 6000 } = defineProps<QuSnackbarQueueProps>()

  const portal = useQuSnackbarPortal()

  orphan('QuSnackbarQueue', portal)

  const namespace = toRef(() => _namespace ?? portal?.namespace.value ?? QU_SNACKBAR_NAMESPACE)

  const notifications = useNotifications(namespace.value)

  /** The display queue in arrival order; the last entry is the newest. */
  const tickets = toRef(() => notifications.queue.values())

  const newest = toRef((): NotificationTicket | undefined => {
    const last = tickets.value.at(-1)

    return last ? notifications.get(last.id) : undefined
  })

  /*
   * One snackbar at a time, never stacked: a newer notification sends the
   * shown one off screen, so everything older leaves the display queue (the
   * inbox entry stays). The survivor is re-timed when it arrived with the
   * plugin-wide default rather than its own timeout.
   */
  function sync () {
    const list = tickets.value
    const last = list.at(-1)

    if (!last) return

    for (const ticket of list.slice(0, -1)) notifications.queue.unregister(ticket.id)

    const wanted = notifications.get(last.id)?.timeout ?? timeout

    if (last.timeout === wanted) return

    notifications.queue.unregister(last.id)
    notifications.queue.register({ id: last.id, timeout: wanted })
  }

  watch(() => tickets.value.map(ticket => ticket.id).join(','), sync, { immediate: true })

  // The rendered ticket lags the newest one by the exit motion: the first
  // contracts downward before the second animates upward (spec 7).
  const shown = shallowRef<NotificationTicket | undefined>(newest.value)
  const present = shallowRef(!isUndefined(newest.value))

  watch(newest, ticket => {
    if (isUndefined(shown.value)) {
      shown.value = ticket
      present.value = !isUndefined(ticket)

      return
    }

    present.value = ticket?.id === shown.value.id
  })

  function settle () {
    shown.value = newest.value
    present.value = !isUndefined(newest.value)
  }

  provideQuSnackbarQueue({
    id: toRef(() => shown.value?.id),
    present: toRef(() => present.value),
    settle,
  })
</script>

<template>
  <Snackbar.Queue class="quantum-snackbar-queue" :namespace>
    <slot v-if="shown" :item="shown" />
  </Snackbar.Queue>
</template>

<style>
  .quantum-snackbar-queue {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
</style>
