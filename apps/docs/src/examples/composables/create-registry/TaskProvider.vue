<script setup lang="ts">
  import { createRegistry } from '@vuetify/v0'
  import { computed, shallowRef } from 'vue'

  import { provideTaskRegistry, type TaskTicketInput } from './context'

  const registry = createRegistry<TaskTicketInput>({ events: true })
  const version = shallowRef(0)
  const eventLog = shallowRef<string[]>([])

  registry.on('register:ticket', ticket => {
    eventLog.value = [...eventLog.value.slice(-4), `+ Registered "${ticket.value}"`]
  })

  registry.on('unregister:ticket', ticket => {
    eventLog.value = [...eventLog.value.slice(-4), `- Removed "${ticket.value}"`]
  })

  registry.onboard([
    { id: 'task-1', value: 'Set up CI pipeline', priority: 'high', done: false },
    { id: 'task-2', value: 'Write unit tests', priority: 'medium', done: false },
    { id: 'task-3', value: 'Update README', priority: 'low', done: true },
    { id: 'task-4', value: 'Review PR #42', priority: 'high', done: false },
    { id: 'task-5', value: 'Refactor auth module', priority: 'medium', done: false },
  ])

  const tasks = computed(() => {
    void version.value
    return registry.values()
  })

  function addTask (text: string, priority: TaskTicketInput['priority']) {
    registry.register({ value: text, priority, done: false })
    version.value++
  }

  function removeTask (id: string | number) {
    registry.unregister(id)
    version.value++
  }

  function toggleDone (id: string | number) {
    const ticket = registry.get(id)
    if (!ticket) return
    registry.upsert(id, { done: !ticket.done })
    version.value++
  }

  function clearCompleted () {
    registry.offboard(tasks.value.filter(t => t.done).map(t => t.id))
    version.value++
  }

  provideTaskRegistry({ tasks, eventLog, addTask, removeTask, toggleDone, clearCompleted })
</script>

<template>
  <slot />
</template>
