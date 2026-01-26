<script setup lang="ts">
  import { toRef } from 'vue'

  import { useNotifications } from './context'

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

  function addRandom (type: 'info' | 'success' | 'warning' | 'error') {
    const list = messages[type]
    const msg = list[Math.floor(Math.random() * list.length)]
    notify(`${msg?.title}|${msg?.desc}`, type)
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Controls -->
    <div class="flex justify-center gap-2">
      <button
        class="w-24 py-1.5 bg-info text-on-info rounded font-medium text-sm hover:opacity-90"
        @click="addRandom('info')"
      >
        + Info
      </button>
      <button
        class="w-24 py-1.5 bg-success text-on-success rounded font-medium text-sm hover:opacity-90"
        @click="addRandom('success')"
      >
        + Success
      </button>
      <button
        class="w-24 py-1.5 bg-warning text-on-warning rounded font-medium text-sm hover:opacity-90"
        @click="addRandom('warning')"
      >
        + Warning
      </button>
      <button
        class="w-24 py-1.5 bg-error text-on-error rounded font-medium text-sm hover:opacity-90"
        @click="addRandom('error')"
      >
        + Error
      </button>
    </div>

    <!-- Clear button -->
    <div v-if="count > 0" class="flex justify-center">
      <button
        class="px-3 py-1.5 bg-surface-variant text-on-surface-variant rounded text-sm hover:opacity-80"
        @click="clear"
      >
        Clear All ({{ count }})
      </button>
    </div>

    <!-- Notification display -->
    <div
      class="flex flex-col gap-2 min-h-32 p-3 bg-surface-variant/30 rounded-lg border border-divider"
      :class="count === 0 ? 'border-dashed' : ''"
    >
      <TransitionGroup class="flex flex-col gap-2" name="notif" tag="div">
        <div
          v-for="n in notifications"
          :key="n.id"
          class="flex items-start justify-between gap-4 px-3 py-2 border rounded cursor-pointer transition-all hover:opacity-80"
          :class="styles[n.type]"
          @click="dismiss(n.id)"
        >
          <div class="flex flex-col gap-0.5">
            <span class="text-sm font-medium">{{ n.message.split('|')[0] }}</span>
            <span class="text-xs opacity-70">{{ n.message.split('|')[1] }}</span>
          </div>
          <span class="text-xs opacity-60 shrink-0">dismiss</span>
        </div>
      </TransitionGroup>

      <p
        v-if="count === 0"
        class="text-on-surface-variant text-sm opacity-50 text-center py-8"
      >
        No notifications. Click a button above to add one.
      </p>
    </div>
  </div>
</template>

<style scoped>
  .notif-enter-active,
  .notif-leave-active {
    transition: all 0.2s ease;
  }

  .notif-enter-from {
    opacity: 0;
    transform: translateX(-10px);
  }

  .notif-leave-to {
    opacity: 0;
    transform: translateX(10px);
  }
</style>
