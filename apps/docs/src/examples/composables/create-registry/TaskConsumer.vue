<script setup lang="ts">
  import AppIcon from '@/components/app/AppIcon.vue'
  import { computed, shallowRef } from 'vue'

  import { useTaskRegistry, type TaskTicket } from './context'

  const { tasks, eventLog, addTask, removeTask, toggleDone, clearCompleted } = useTaskRegistry()

  const newTask = shallowRef('')
  const newPriority = shallowRef<TaskTicket['priority']>('medium')
  const filterPriority = shallowRef<TaskTicket['priority'] | 'all'>('all')

  const filteredTasks = computed(() => {
    if (filterPriority.value === 'all') return tasks.value
    return tasks.value.filter(t => t.priority === filterPriority.value)
  })

  const stats = computed(() => ({
    total: tasks.value.length,
    done: tasks.value.filter(t => t.done).length,
    high: tasks.value.filter(t => t.priority === 'high' && !t.done).length,
  }))

  function handleAdd () {
    const text = newTask.value.trim()
    if (!text) return
    addTask(text, newPriority.value)
    newTask.value = ''
  }

  const priorityStyles: Record<string, { dot: string, badge: string }> = {
    high: { dot: 'bg-error', badge: 'bg-error/10 text-error' },
    medium: { dot: 'bg-warning', badge: 'bg-warning/10 text-warning' },
    low: { dot: 'bg-primary', badge: 'bg-primary/10 text-primary' },
  }
</script>

<template>
  <div class="space-y-4">
    <!-- Stats bar -->
    <div class="flex items-center gap-4 text-xs text-on-surface-variant">
      <span>{{ stats.total }} tasks</span>
      <span class="text-success">{{ stats.done }} done</span>
      <span v-if="stats.high > 0" class="text-error">{{ stats.high }} high priority</span>
      <span class="ml-auto font-mono text-on-surface-variant/60">
        registry.size = {{ tasks.length }}
      </span>
    </div>

    <!-- Add task -->
    <div class="flex gap-2">
      <select
        v-model="newPriority"
        class="px-2 py-1.5 text-xs rounded-lg border border-divider bg-surface text-on-surface"
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <input
        v-model="newTask"
        class="flex-1 px-3 py-1.5 text-sm rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary"
        placeholder="Add a task..."
        @keydown.enter="handleAdd"
      >
      <button
        class="px-3 py-1.5 text-sm rounded-lg bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-40 transition-colors"
        :disabled="!newTask.trim()"
        @click="handleAdd"
      >
        Add
      </button>
    </div>

    <!-- Filter -->
    <div class="flex items-center gap-1.5">
      <button
        v-for="f in (['all', 'high', 'medium', 'low'] as const)"
        :key="f"
        class="px-2 py-0.5 text-xs rounded-md border transition-all"
        :class="filterPriority === f
          ? 'border-primary bg-primary/10 text-primary font-medium'
          : 'border-divider text-on-surface-variant hover:border-primary/50'"
        @click="filterPriority = f"
      >
        {{ f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) }}
      </button>
      <button
        v-if="stats.done > 0"
        class="ml-auto text-xs text-on-surface-variant hover:text-error transition-colors"
        @click="clearCompleted"
      >
        Clear {{ stats.done }} completed
      </button>
    </div>

    <!-- Task list -->
    <div class="space-y-1">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="group flex items-center gap-3 px-3 py-2 rounded-lg border transition-all"
        :class="task.done
          ? 'border-divider/50 bg-surface-variant/20'
          : 'border-divider hover:border-primary/30'"
      >
        <button
          class="size-4.5 rounded border-2 flex items-center justify-center transition-all"
          :class="task.done
            ? 'border-primary bg-primary'
            : 'border-divider hover:border-primary'"
          @click="toggleDone(task.id)"
        >
          <AppIcon v-if="task.done" class="text-on-primary" icon="check" :size="12" />
        </button>

        <span
          class="size-2 rounded-full flex-shrink-0"
          :class="priorityStyles[task.priority].dot"
        />

        <span
          class="flex-1 text-sm transition-all"
          :class="task.done ? 'line-through text-on-surface-variant/60' : 'text-on-surface'"
        >
          {{ task.value }}
        </span>

        <span
          class="px-1.5 py-0.5 text-[10px] rounded font-medium"
          :class="priorityStyles[task.priority].badge"
        >
          {{ task.priority }}
        </span>

        <span class="text-[10px] font-mono text-on-surface-variant/40">#{{ task.index }}</span>

        <button
          class="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error transition-all"
          @click="removeTask(task.id)"
        >
          <AppIcon icon="close" :size="14" />
        </button>
      </div>

      <p
        v-if="filteredTasks.length === 0"
        class="text-center text-sm text-on-surface-variant py-4"
      >
        {{ filterPriority === 'all' ? 'No tasks yet.' : `No ${filterPriority} priority tasks.` }}
      </p>
    </div>

    <!-- Event log -->
    <div class="rounded-lg bg-surface-variant/30 p-3">
      <p class="text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-1.5">Event log</p>
      <div class="space-y-0.5">
        <p
          v-for="(entry, i) in eventLog"
          :key="i"
          class="text-xs font-mono"
          :class="entry.startsWith('+') ? 'text-success' : 'text-error'"
        >
          {{ entry }}
        </p>
        <p v-if="eventLog.length === 0" class="text-xs text-on-surface-variant/60">
          Events will appear here as you add and remove tasks...
        </p>
      </div>
    </div>
  </div>
</template>
