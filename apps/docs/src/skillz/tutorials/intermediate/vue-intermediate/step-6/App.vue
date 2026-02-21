<script setup>
  // Components
  import NotificationItem from './NotificationItem.vue'

  // Utilities
  import { ref, onMounted } from 'vue'

  const notifications = ref([])
  const loading = ref(true)
  const now = ref(Date.now())
  let _timer
  let nextId = 4

  const mockData = [
    { id: 1, text: 'Deployment complete', type: 'success', read: false, createdAt: Date.now() - 120_000 },
    { id: 2, text: 'New pull request opened', type: 'info', read: false, createdAt: Date.now() - 45_000 },
    { id: 3, text: 'Build failed — check logs', type: 'error', read: false, createdAt: Date.now() - 10_000 },
  ]

  function formatTimeAgo (timestamp) {
    const seconds = Math.floor((now.value - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }

  onMounted(() => {
    setTimeout(() => {
      notifications.value = mockData
      loading.value = false
    }, 1500)

    _timer = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })

  function addNotification () {
    const types = ['info', 'success', 'warning', 'error']
    notifications.value.unshift({
      id: nextId++,
      text: `Alert #${nextId - 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      read: false,
      createdAt: Date.now(),
    })
  }

  function dismissNotification (id) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  function markRead (id) {
    const n = notifications.value.find(n => n.id === id)
    if (n) n.read = true
  }
</script>

<template>
  <div class="p-8">
    <div class="flex items-center gap-3 mb-6">
      <h1 class="text-2xl font-bold">
        Emitting Events
      </h1>

      <span
        v-if="notifications.some(n => !n.read)"
        class="px-2 py-0.5 text-xs font-bold rounded-full bg-error text-on-error"
      >
        {{ notifications.filter(n => !n.read).length }}
      </span>
    </div>

    <button
      class="px-4 py-2 mb-6 rounded font-medium bg-primary text-on-primary"
      :disabled="loading"
      @click="addNotification"
    >
      Add notification
    </button>

    <div v-if="loading" class="space-y-2">
      <div
        v-for="i in 3"
        :key="i"
        class="h-14 rounded-lg bg-surface-tint animate-pulse"
      />
    </div>

    <ul v-else class="space-y-2">
      <NotificationItem
        v-for="n in notifications"
        :key="n.id"
        :read="n.read"
        :text="n.text"
        :time="formatTimeAgo(n.createdAt)"
        :type="n.type"
        @dismiss="dismissNotification(n.id)"
        @mark-read="markRead(n.id)"
      />

      <li
        v-if="notifications.length === 0"
        class="p-3 rounded-lg bg-surface text-on-surface-variant text-center"
      >
        No notifications
      </li>
    </ul>
  </div>
</template>
