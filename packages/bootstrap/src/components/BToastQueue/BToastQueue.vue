<script lang="ts">
  // Framework
  import { createQueue, isString, useTimer } from '@vuetify/v0'

  // Utilities
  import { shallowReactive, toRef } from 'vue'

  // Types
  import type { ID } from '@vuetify/v0'

  import BToast from '../BToast/BToast.vue'
  import BToastBody from '../BToastBody/BToastBody.vue'
  import BToastClose from '../BToastClose/BToastClose.vue'

  export interface BToastPushOptions {
    /** Hide this toast after `delay`. Defaults to the queue's `autohide`. */
    autohide?: boolean
    /** Milliseconds before this toast hides. Defaults to the queue's `delay`. */
    delay?: number
  }

  export interface BToastQueueProps {
    /**
     * Hide each pushed toast after `delay`.
     *
     * @default true
     */
    autohide?: boolean
    /**
     * Milliseconds before a pushed toast hides itself.
     *
     * @default 5000
     */
    delay?: number
  }

  export interface BToastQueueItem {
    id: ID
    value: string
    autohide: boolean
    delay: number
    dismiss: () => void
  }

  export interface BToastQueueSlotProps {
    items: readonly BToastQueueItem[]
    push: (message: string, options?: BToastPushOptions) => string
  }

  // `.toast` fades out over 0.15s. The node stays up through that, then leaves.
  const HIDE_MS = 200
</script>

<script setup lang="ts">
  defineOptions({ name: 'BToastQueue' })

  defineSlots<{
    default?: (props: BToastQueueSlotProps) => any
  }>()

  const {
    autohide = true,
    delay = 5000,
  } = defineProps<BToastQueueProps>()

  // Bootstrap shows every toast in the stack at once. createQueue's own timer
  // runs one ticket at a time, so these tickets opt out of it.
  const queue = createQueue({
    reactive: true,
    timeout: -1,
  })

  const shown = shallowReactive(new Set<ID>())
  const options = shallowReactive(new Map<ID, { autohide: boolean, delay: number }>())

  const tickets = toRef((): BToastQueueItem[] => queue.values().map(ticket => {
    const picked = options.get(ticket.id)

    return {
      autohide: picked?.autohide ?? autohide,
      delay: picked?.delay ?? delay,
      dismiss: () => hide(ticket.id),
      id: ticket.id,
      value: isString(ticket.value) ? ticket.value : '',
    }
  }))

  function push (message: string, pushed: BToastPushOptions = {}): string {
    const ticket = queue.register({
      timeout: -1,
      value: message,
    })

    options.set(ticket.id, {
      autohide: pushed.autohide ?? autohide,
      delay: pushed.delay ?? delay,
    })
    shown.add(ticket.id)

    return String(ticket.id)
  }

  function hide (id: ID) {
    if (!shown.has(id)) return

    shown.delete(id)

    const timer = useTimer(() => {
      options.delete(id)
      queue.unregister(id)
    }, { duration: HIDE_MS })

    timer.start()
  }

  function onModel (id: ID, value: boolean) {
    if (value) return

    hide(id)
  }

  defineExpose({ push })
</script>

<template>
  <div class="toast-container">
    <slot :items="tickets" :push>
      <BToast
        v-for="ticket in tickets"
        :key="ticket.id"
        :autohide="ticket.autohide"
        :delay="ticket.delay"
        :model-value="shown.has(ticket.id)"
        @update:model-value="(value) => onModel(ticket.id, value)"
      >
        <div class="d-flex justify-content-between">
          <BToastBody>{{ ticket.value }}</BToastBody>

          <BToastClose class="m-auto me-3" />
        </div>
      </BToast>
    </slot>
  </div>
</template>
