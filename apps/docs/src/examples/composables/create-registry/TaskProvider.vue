<script setup lang="ts">
  import { createRegistry, useProxyRegistry } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  import { provideTaskRegistry, type TaskTicket, type TaskTicketInput } from './context'

  const registry = createRegistry<TaskTicketInput, TaskTicket>({ events: true })
  const proxy = useProxyRegistry(registry)
  const events = shallowRef<string[]>([])

  registry.on('register:ticket', ticket => {
    events.value = [...events.value.slice(-4), `+ Registered "${ticket.value}"`]
  })

  registry.on('unregister:ticket', ticket => {
    events.value = [...events.value.slice(-4), `- Removed "${ticket.value}"`]
  })

  registry.onboard([
    { id: 'task-1', value: 'Set up CI pipeline', priority: 'high', done: false },
    { id: 'task-2', value: 'Write unit tests', priority: 'medium', done: false },
    { id: 'task-3', value: 'Update README', priority: 'low', done: true },
    { id: 'task-4', value: 'Review PR #42', priority: 'high', done: false },
    { id: 'task-5', value: 'Refactor auth module', priority: 'medium', done: false },
  ])

  function add (text: string, priority: TaskTicketInput['priority']) {
    registry.register({ value: text, priority, done: false })
  }

  function remove (id: string | number) {
    registry.unregister(id)
  }

  function toggle (id: string | number) {
    const ticket = registry.get(id)
    if (!ticket) return
    registry.upsert(id, { done: !ticket.done })
  }

  function clear () {
    registry.offboard(registry.values().filter(t => t.done).map(t => t.id))
  }

  provideTaskRegistry({ proxy, events, add, remove, toggle, clear })
</script>

<template>
  <slot />
</template>
