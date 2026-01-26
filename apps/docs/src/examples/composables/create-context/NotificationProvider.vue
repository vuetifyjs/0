<script setup lang="ts">
  import { shallowReactive } from 'vue'

  import { provideNotifications } from './context'

  const notifications = shallowReactive<{ id: number, message: string, type: 'info' | 'success' | 'warning' | 'error' }[]>([])
  let nextId = 0

  function notify (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    notifications.push({ id: nextId++, message, type })
  }

  function dismiss (id: number) {
    const index = notifications.findIndex(n => n.id === id)
    if (index !== -1) notifications.splice(index, 1)
  }

  function clear () {
    notifications.length = 0
  }

  provideNotifications({ notifications, notify, dismiss, clear })
</script>

<template>
  <slot />
</template>
