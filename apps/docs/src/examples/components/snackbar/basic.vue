<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { Snackbar, createQueue, useProxyRegistry } from '@vuetify/v0'
  import type { NotificationSeverity } from '@vuetify/v0'

  interface ToastInput {
    subject: string
    severity: NotificationSeverity
  }

  const queue = createQueue<ToastInput>({ timeout: 4000 })
  const proxy = useProxyRegistry(queue)

  const severities: NotificationSeverity[] = ['info', 'success', 'warning', 'error']
  const index = shallowRef(0)

  const messages: Record<NotificationSeverity, string> = {
    info: 'Deployment started for production',
    success: 'Changes saved successfully',
    warning: 'API rate limit at 80%',
    error: 'Build failed — check logs',
  }

  const classes: Record<NotificationSeverity, string> = {
    info: 'bg-info text-on-info',
    success: 'bg-success text-on-success',
    warning: 'bg-warning text-on-warning',
    error: 'bg-error text-on-error',
  }

  function onShow () {
    const severity = severities[index.value % severities.length]
    index.value++
    queue.register({ subject: messages[severity], severity })
  }
</script>

<template>
  <div class="relative flex flex-col items-center gap-6 min-h-48 p-6 bg-background rounded-lg border border-divider overflow-hidden">
    <button
      class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium"
      @click="onShow"
    >
      Show Toast
    </button>

    <p class="text-sm opacity-40">
      Cycles through info → success → warning → error
    </p>

    <Snackbar.Portal :teleport="false" class="absolute bottom-4 right-4 flex flex-col gap-2 w-72">
      <TransitionGroup
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in absolute w-full"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        move-class="transition duration-200"
      >
        <Snackbar.Root
          v-for="ticket in proxy.values"
          :key="ticket.id"
          :severity="ticket.severity"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-lg text-sm"
          :class="classes[ticket.severity]"
        >
          <Snackbar.Content class="flex-1">
            {{ ticket.subject }}
          </Snackbar.Content>

          <Snackbar.Close
            class="p-1 -mr-1 opacity-70 hover:opacity-100"
            @click="ticket.dismiss()"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor" />
            </svg>
          </Snackbar.Close>
        </Snackbar.Root>
      </TransitionGroup>
    </Snackbar.Portal>
  </div>
</template>
