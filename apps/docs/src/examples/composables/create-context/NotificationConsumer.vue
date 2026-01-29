<script setup lang="ts">
  import { toRef } from 'vue'
  import { useNotifications } from './context'
  import type { Notification } from './context'

  const { notifications, notify, dismiss, clear } = useNotifications()

  const count = toRef(() => notifications.length)

  const styles = {
    info: 'bg-info/15 border-info/30 text-info',
    success: 'bg-success/15 border-success/30 text-success',
    warning: 'bg-warning/15 border-warning/30 text-warning',
    error: 'bg-error/15 border-error/30 text-error',
  }

  const messages = {
    info: [
      { title: 'New message received', desc: 'You have 3 unread messages in your inbox' },
      { title: 'Update available', desc: 'Version 2.4.1 is ready to install' },
      { title: 'Sync complete', desc: 'All files have been synchronized' },
    ],
    success: [
      { title: 'Changes saved', desc: 'Your preferences have been updated' },
      { title: 'File uploaded', desc: 'document.pdf uploaded successfully' },
      { title: 'Payment processed', desc: 'Receipt sent to your email' },
    ],
    warning: [
      { title: 'Storage almost full', desc: 'Only 2.3 GB remaining on your account' },
      { title: 'Session expiring soon', desc: 'You will be logged out in 5 minutes' },
      { title: 'Slow connection', desc: 'Some features may take longer to load' },
    ],
    error: [
      { title: 'Connection failed', desc: 'Unable to reach the server' },
      { title: 'Invalid input', desc: 'Please check the form for errors' },
      { title: 'Permission denied', desc: 'You do not have access to this resource' },
    ],
  }

  function random (type: Notification['type']) {
    const list = messages[type]
    const msg = list[Math.floor(Math.random() * list.length)]!
    notify(msg.title, msg.desc, type)
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Controls -->
    <div class="flex justify-center gap-2">
      <button
        class="w-24 py-1.5 bg-info text-on-info rounded font-medium text-sm hover:opacity-90"
        @click="random('info')"
      >
        + Info
      </button>
      <button
        class="w-24 py-1.5 bg-success text-on-success rounded font-medium text-sm hover:opacity-90"
        @click="random('success')"
      >
        + Success
      </button>
      <button
        class="w-24 py-1.5 bg-warning text-on-warning rounded font-medium text-sm hover:opacity-90"
        @click="random('warning')"
      >
        + Warning
      </button>
      <button
        class="w-24 py-1.5 bg-error text-on-error rounded font-medium text-sm hover:opacity-90"
        @click="random('error')"
      >
        + Error
      </button>
    </div>

    <!-- Notification display -->
    <div
      class="flex flex-col min-h-32 bg-surface-variant/30 rounded-lg border border-divider transition-colors"
      :class="count === 0 ? 'border-dashed' : ''"
    >
      <!-- Header -->
      <div v-if="count > 0" class="flex items-center justify-between px-3 py-2 text-xs text-on-surface-variant/60">
        <span>{{ count }} notification{{ count > 1 ? 's' : '' }}</span>
        <button
          class="hover:text-on-surface-variant transition-colors"
          @click="clear"
        >
          Clear
        </button>
      </div>

      <!-- List -->
      <div v-if="count > 0" class="flex flex-col gap-2 px-3 pb-3">
        <div
          v-for="n in notifications"
          :key="n.id"
          class="flex items-start justify-between gap-4 px-3 py-2 border rounded cursor-pointer hover:opacity-80"
          :class="styles[n.type]"
          @click="dismiss(n.id)"
        >
          <div class="flex flex-col gap-0.5">
            <span class="text-sm font-medium">{{ n.title }}</span>
            <span v-if="n.description" class="text-xs opacity-70">{{ n.description }}</span>
          </div>
          <span class="text-xs opacity-60 shrink-0">dismiss</span>
        </div>
      </div>

      <div
        v-if="count === 0"
        class="flex-1 flex items-center justify-center text-on-surface-variant text-sm opacity-50"
      >
        No notifications. Click a button above to add one.
      </div>
    </div>
  </div>
</template>
