<script setup>
  // Utilities
  import { ref, watch } from 'vue'

  const notifications = ref([
    { id: 1, text: 'Welcome to your notification center!', read: false },
    { id: 2, text: 'You have a new follower', read: false },
    { id: 3, text: 'Your post was liked', read: true },
  ])

  const unreadCount = ref(0)
  const debugLog = ref([])
  let nextId = 4

  // Watch the notifications array and update unread count
  watch(notifications, list => {
    unreadCount.value = list.filter(n => !n.read).length
  }, { immediate: true, deep: true })

  function addNotification () {
    notifications.value.push({
      id: nextId++,
      text: `New notification #${nextId - 1}`,
      read: false,
    })
    debugLog.value.push(`Added notification #${nextId - 1}`)
  }

  function toggleRead (notification) {
    notification.read = !notification.read
    debugLog.value.push(`Toggled #${notification.id} → ${notification.read ? 'read' : 'unread'}`)
  }
</script>

<template>
  <div class="p-8">
    <div class="flex items-center gap-3 mb-6">
      <h1 class="text-2xl font-bold">
        Notifications
      </h1>

      <span
        v-if="unreadCount > 0"
        class="px-2 py-0.5 text-xs font-bold rounded-full bg-error text-on-error"
      >
        {{ unreadCount }}
      </span>
    </div>

    <button
      class="px-4 py-2 mb-6 rounded font-medium bg-primary text-on-primary"
      @click="addNotification"
    >
      Add notification
    </button>

    <ul class="space-y-2 mb-8">
      <li
        v-for="n in notifications"
        :key="n.id"
        class="p-3 rounded-lg cursor-pointer border border-solid border-divider"
        :class="n.read ? 'bg-surface' : 'bg-surface-tint'"
        @click="toggleRead(n)"
      >
        <div class="flex items-center justify-between">
          <span :class="n.read ? 'text-on-surface-variant' : 'text-on-background font-medium'">
            {{ n.text }}
          </span>

          <span class="text-xs text-on-surface-variant">
            {{ n.read ? 'read' : 'unread' }}
          </span>
        </div>
      </li>
    </ul>

    <div class="p-4 rounded-lg bg-surface text-sm">
      <h2 class="font-bold mb-2 text-on-surface-variant">
        Debug log
      </h2>

      <div v-if="debugLog.length === 0" class="text-on-surface-variant">
        No events yet
      </div>

      <div v-else class="space-y-1">
        <p v-for="(entry, i) in debugLog" :key="i" class="text-on-surface-variant">
          {{ entry }}
        </p>
      </div>
    </div>
  </div>
</template>
