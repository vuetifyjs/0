<script setup lang="ts">
  import { shallowReactive } from 'vue'

  import { provideNotifications, type Notification } from './context'

  const notifications = shallowReactive<Notification[]>([])
  let nextId = 0

  function notify (
    title: string,
    description?: string,
    type: Notification['type'] = 'info',
  ) {
    notifications.push({ id: nextId++, title, description, type })
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
