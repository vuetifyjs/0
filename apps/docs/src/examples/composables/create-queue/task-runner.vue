<script setup lang="ts">
  import { createQueue, useProxyRegistry, type QueueTicket } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  interface Task extends QueueTicket {
    name: string
    progress: number
    status: 'pending' | 'running' | 'done'
    isNew?: boolean
  }

  const queue = createQueue<Task>({ timeout: -1, events: true })
  const proxy = useProxyRegistry(queue)
  const completed = shallowRef<Task[]>([])
  const taskId = shallowRef(0)

  const taskNames = ['Build assets', 'Run tests', 'Deploy staging', 'Sync database', 'Generate docs']

  function addTask () {
    const name = taskNames[taskId.value % taskNames.length]
    taskId.value++

    const task = queue.register({
      name,
      progress: 0,
      status: queue.size === 1 ? 'running' : 'pending',
      isNew: true,
    })

    setTimeout(() => queue.upsert(task.id, { isNew: false } as Partial<Task>), 600)

    if (queue.size === 1) runTask(task)
  }

  function removeCompleted (id: string) {
    completed.value = completed.value.filter(t => t.id !== id)
  }

  function runTask (task: Task) {
    const interval = setInterval(() => {
      const current = queue.get(task.id)
      if (!current) return clearInterval(interval)

      const newProgress = Math.min(current.progress + Math.random() * 15, 100)
      queue.upsert(task.id, { progress: newProgress, status: 'running' } as Partial<Task>)

      if (newProgress >= 100) {
        clearInterval(interval)
        completed.value = [{ ...current, progress: 100, status: 'done' }, ...completed.value].slice(0, 5)
        queue.unregister(task.id)

        const next = queue.seek('first')
        if (next) runTask(next)
      }
    }, 200)
  }

  const pending = toRef(() => proxy.values.filter(t => t.status === 'pending'))
  const running = toRef(() => proxy.values.find(t => t.status === 'running'))
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <button
        class="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:opacity-90 transition-opacity"
        @click="addTask"
      >
        {{ proxy.size > 0 ? `(${proxy.size})` : '+' }} Add Task
      </button>
    </div>

    <div v-if="running" class="p-4 bg-surface border border-primary rounded-lg">
      <div class="flex items-center justify-between mb-2">
        <span class="font-medium text-on-surface">{{ running.name }}</span>
        <span class="text-xs text-primary font-mono">{{ Math.round(running.progress) }}%</span>
      </div>
      <div class="h-2 bg-surface-variant rounded-full overflow-hidden">
        <div
          class="h-full bg-primary rounded-full transition-all duration-200"
          :style="{ width: `${running.progress}%` }"
        />
      </div>
    </div>

    <div v-if="pending.length > 0" class="flex flex-col gap-2">
      <span class="text-xs text-on-surface opacity-50 uppercase tracking-wide">Pending</span>
      <TransitionGroup class="flex flex-col gap-1" name="task" tag="div">
        <div
          v-for="task in pending"
          :key="task.id"
          class="px-3 py-2 bg-surface-variant rounded flex items-center justify-between text-sm transition-all"
          :class="task.isNew ? 'ring-2 ring-primary/50 bg-primary/10' : ''"
        >
          <span class="text-on-surface-variant">{{ task.name }}</span>
          <span class="text-xs opacity-50">#{{ task.index + 1 }}</span>
        </div>
      </TransitionGroup>
    </div>

    <div v-if="completed.length > 0" class="flex flex-col gap-2">
      <span class="text-xs text-on-surface opacity-50 uppercase tracking-wide">Completed</span>
      <TransitionGroup class="flex flex-col gap-1" name="done" tag="div">
        <div
          v-for="task in completed"
          :key="task.id"
          class="px-3 py-2 bg-success/10 border border-success/20 rounded flex items-center justify-between text-sm cursor-pointer hover:bg-success/20 transition-colors"
          @click="removeCompleted(task.id)"
        >
          <span class="text-success">{{ task.name }}</span>
          <span class="text-success text-xs">✓</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
  .task-enter-active,
  .task-leave-active,
  .done-enter-active,
  .done-leave-active {
    transition: opacity 0.2s ease;
  }

  .task-enter-from,
  .task-leave-to,
  .done-enter-from,
  .done-leave-to {
    opacity: 0;
  }
</style>
