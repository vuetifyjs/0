<script setup lang="ts">
  import { shallowRef, watch } from 'vue'
  import { Scrim, useStack } from '@vuetify/v0'

  const stack = useStack()

  const open = shallowRef(false)
  const ticket = stack.register({
    onDismiss: () => {
      open.value = false
    },
    blocking: false,
  })

  watch(open, v => v ? ticket.select() : ticket.unselect())

  const blocking = shallowRef(false)
  const blockingTicket = stack.register({
    onDismiss: () => {
      blocking.value = false
    },
    blocking: true,
  })

  watch(blocking, v => v ? blockingTicket.select() : blockingTicket.unselect())
</script>

<template>
  <div class="flex gap-3 justify-center">
    <button
      class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium"
      @click="open = true"
    >
      Open Overlay
    </button>

    <button
      class="px-4 py-2 bg-error text-on-error rounded-md text-sm font-medium"
      @click="blocking = true"
    >
      Open Blocking
    </button>
  </div>

  <Scrim
    class="fixed inset-0 bg-black/50"
    :teleport="false"
  />

  <div
    v-if="open"
    class="fixed inset-0 flex items-center justify-center"
    :style="{ zIndex: ticket.zIndex.value }"
  >
    <div class="rounded-xl bg-surface border border-divider p-6 max-w-sm w-full shadow-lg">
      <h3 class="text-lg font-semibold text-on-surface mb-2">
        Dismissible Overlay
      </h3>

      <p class="text-sm text-on-surface-variant mb-4">
        Click the scrim backdrop to dismiss this overlay.
      </p>

      <button
        class="px-4 py-2 text-sm font-medium rounded-md border border-divider hover:bg-surface-tint"
        @click="open = false"
      >
        Close
      </button>
    </div>
  </div>

  <div
    v-if="blocking"
    class="fixed inset-0 flex items-center justify-center"
    :style="{ zIndex: blockingTicket.zIndex.value }"
  >
    <div class="rounded-xl bg-surface border border-divider p-6 max-w-sm w-full shadow-lg">
      <h3 class="text-lg font-semibold text-on-surface mb-2">
        Blocking Overlay
      </h3>

      <p class="text-sm text-on-surface-variant mb-4">
        This overlay blocks scrim dismissal. You must use the button to close it.
      </p>

      <button
        class="px-4 py-2 text-sm font-medium rounded-md bg-error text-on-error"
        @click="blocking = false"
      >
        Confirm Close
      </button>
    </div>
  </div>
</template>
