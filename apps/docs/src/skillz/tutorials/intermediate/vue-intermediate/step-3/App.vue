<script setup>
  // Utilities
  import { ref, watch, nextTick, useTemplateRef } from 'vue'

  const notifications = ref([
    { id: 1, text: 'Welcome to the notification center!' },
    { id: 2, text: 'Scroll behavior is now automatic' },
    { id: 3, text: 'New items appear at the bottom' },
    { id: 4, text: 'The list scrolls to show them' },
    { id: 5, text: 'Try adding more notifications' },
  ])

  const listEl = useTemplateRef('list')
  let nextId = 6

  // Auto-scroll to bottom when notifications change
  watch(notifications, async () => {
    await nextTick()
    if (listEl.value) {
      listEl.value.scrollTop = listEl.value.scrollHeight
    }
  }, { deep: true })

  function addNotification () {
    notifications.value.push({
      id: nextId,
      text: `Notification #${nextId} just arrived`,
    })
    nextId++
  }

  function scrollToTop () {
    if (listEl.value) {
      listEl.value.scrollTop = 0
    }
  }
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">
      Template Refs
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
        @click="scrollToTop"
      >
        Scroll to top
      </button>
    </div>

    <div
      ref="list"
      class="max-h-64 overflow-y-auto rounded-lg border border-solid border-divider"
    >
      <ul class="divide-y divide-divider">
        <li
          v-for="n in notifications"
          :key="n.id"
          class="p-3 bg-surface"
        >
          <span class="text-on-surface">{{ n.text }}</span>
        </li>
      </ul>
    </div>

    <p class="mt-4 text-sm text-on-surface-variant">
      {{ notifications.length }} notifications in the feed
    </p>
  </div>
</template>
