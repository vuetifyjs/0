<script setup>
  // Utilities
  import { ref, onMounted, onUnmounted } from 'vue'

  const notifications = ref([])
  const loading = ref(true)
  const now = ref(Date.now())
  let timer

  const mockData = [
    { id: 1, text: 'Deployment complete', createdAt: Date.now() - 120_000 },
    { id: 2, text: 'New pull request opened', createdAt: Date.now() - 45_000 },
    { id: 3, text: 'Tests passed on main', createdAt: Date.now() - 10_000 },
  ]

  function formatTimeAgo (timestamp) {
    const seconds = Math.floor((now.value - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }

  // Simulate loading data on mount
  onMounted(() => {
    setTimeout(() => {
      notifications.value = mockData
      loading.value = false
    }, 1500)

    // Update "time ago" every second
    timer = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })

  // Clean up the interval on unmount
  onUnmounted(() => {
    clearInterval(timer)
  })

  let nextId = 4

  function addNotification () {
    notifications.value.unshift({
      id: nextId++,
      text: `Alert #${nextId - 1}`,
      createdAt: Date.now(),
    })
  }
</script>

<template>
  <div class="p-8 font-sans min-h-screen bg-background text-on-background">
    <h1 class="text-2xl font-bold mb-6">
      Lifecycle Hooks
    </h1>

    <button
      class="px-4 py-2 mb-6 rounded font-medium bg-primary text-on-primary"
      :disabled="loading"
      @click="addNotification"
    >
      Add notification
    </button>

    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-2">
      <div
        v-for="i in 3"
        :key="i"
        class="h-14 rounded-lg bg-surface-tint animate-pulse"
      />
    </div>

    <!-- Loaded notifications -->
    <ul v-else class="space-y-2">
      <li
        v-for="n in notifications"
        :key="n.id"
        class="p-3 rounded-lg bg-surface border border-solid border-divider flex items-center justify-between"
      >
        <span class="text-on-surface font-medium">
          {{ n.text }}
        </span>

        <span class="text-xs text-on-surface-variant whitespace-nowrap ml-4">
          {{ formatTimeAgo(n.createdAt) }}
        </span>
      </li>

      <li
        v-if="notifications.length === 0"
        class="p-3 rounded-lg bg-surface text-on-surface-variant text-center"
      >
        No notifications yet
      </li>
    </ul>
  </div>
</template>
