<script setup>
  // Utilities
  import { ref, watch } from 'vue'

  const notifications = ref([
    { id: 1, text: 'Server deployed successfully', read: false, dismissed: false },
    { id: 2, text: 'New comment on your PR', read: false, dismissed: false },
    { id: 3, text: 'Build failed — check logs', read: false, dismissed: false },
  ])

  const statusLog = ref([])
  let nextId = 4

  // Deep watcher tracks read-status changes inside the array
  watch(notifications, list => {
    const readCount = list.filter(n => n.read).length
    const total = list.filter(n => !n.dismissed).length
    statusLog.value.push(`Status: ${readCount}/${total} read`)
  }, { deep: true })

  // Watch for new unread notifications and auto-dismiss after 3s
  watch(() => notifications.value.filter(n => !n.read && !n.dismissed), (unread, _old, onCleanup) => {
    const timers = unread.map(n => {
      return setTimeout(() => {
        n.dismissed = true
        statusLog.value.push(`Auto-dismissed #${n.id}`)
      }, 3000)
    })

    onCleanup(() => {
      for (const t of timers) clearTimeout(t)
    })
  })

  function addNotification () {
    notifications.value.push({
      id: nextId,
      text: `Alert #${nextId}`,
      read: false,
      dismissed: false,
    })
    nextId++
  }

  function markAllRead () {
    for (const n of notifications.value) {
      if (!n.dismissed) n.read = true
    }
    statusLog.value.push('Marked all as read')
  }
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">
      Deep Watchers
    </h1>

    <div class="flex gap-3 mb-6">
      <button
        class="px-4 py-2 rounded font-medium bg-primary text-on-primary"
        @click="addNotification"
      >
        Add notification
      </button>

      <button
        class="px-4 py-2 rounded font-medium bg-surface-tint text-on-background border border-solid border-divider"
        @click="markAllRead"
      >
        Mark all read
      </button>
    </div>

    <ul class="space-y-2 mb-8">
      <li
        v-for="n in notifications.filter(n => !n.dismissed)"
        :key="n.id"
        class="p-3 rounded-lg border border-solid border-divider flex items-center justify-between"
        :class="n.read ? 'bg-surface' : 'bg-surface-tint'"
      >
        <span :class="n.read ? 'text-on-surface-variant' : 'text-on-background font-medium'">
          {{ n.text }}
        </span>

        <div class="flex items-center gap-2">
          <span v-if="!n.read" class="text-xs text-warning">
            auto-dismiss in 3s
          </span>

          <button
            v-if="!n.read"
            class="text-xs px-2 py-1 rounded bg-success text-on-success"
            @click="n.read = true"
          >
            Mark read
          </button>

          <span v-else class="text-xs text-on-surface-variant">
            read
          </span>
        </div>
      </li>

      <li
        v-if="notifications.filter(n => !n.dismissed).length === 0"
        class="p-3 rounded-lg bg-surface text-on-surface-variant text-center"
      >
        All notifications dismissed
      </li>
    </ul>

    <div class="p-4 rounded-lg bg-surface text-sm">
      <h2 class="font-bold mb-2 text-on-surface-variant">
        Watcher log
      </h2>

      <div v-if="statusLog.length === 0" class="text-on-surface-variant">
        No changes yet
      </div>

      <div v-else class="space-y-1 max-h-40 overflow-y-auto">
        <p v-for="(entry, i) in statusLog" :key="i" class="text-on-surface-variant">
          {{ entry }}
        </p>
      </div>
    </div>
  </div>
</template>
