<script setup lang="ts">
  import { createKanban } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  import type { ID } from '@vuetify/v0'
  import { useKanbanView } from './useKanbanView'
  import type { Card, Column } from './types'

  const kanban = createKanban<Card, Column>()

  const todo = kanban.columns.register({ value: { title: 'Todo', tone: 'bg-surface-variant' } })
  const doing = kanban.columns.register({ value: { title: 'Doing', tone: 'bg-info' } })
  kanban.columns.register({ value: { title: 'Done', tone: 'bg-success' } })

  todo.items.register({ value: { title: 'Write spec', assignee: 'Maria' } })
  todo.items.register({ value: { title: 'Write plan', assignee: 'John' } })
  doing.items.register({ value: { title: 'Implement', assignee: 'Maria' } })

  const view = useKanbanView(kanban)

  // kanban.on('transfer:ticket') fires after every successful cross-column move.
  // Payload: { ticket, from, to, fromIndex, toIndex } — all IDs are column ids
  // except ticket.id which is the item id.
  const status = shallowRef('')
  kanban.on('transfer:ticket', ({ ticket, from, to }) => {
    const fromName = view.columns.values.find(col => col.id === from)?.value.title ?? '?'
    const toName = view.columns.values.find(col => col.id === to)?.value.title ?? '?'
    status.value = `Moved "${ticket.value.title}" from ${fromName} → ${toName}`
  })

  function next (cardId: ID, columnId: ID): void {
    const index = view.columns.values.findIndex(col => col.id === columnId)
    const target = view.columns.values[index + 1]
    if (target) kanban.transfer(cardId, target.id, target.items.size)
  }

  function previous (cardId: ID, columnId: ID): void {
    const index = view.columns.values.findIndex(col => col.id === columnId)
    const target = view.columns.values[index - 1]
    if (target) kanban.transfer(cardId, target.id, target.items.size)
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="grid gap-3 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
      <div
        v-for="column in view.columns.values"
        :key="column.id"
        class="min-w-0 min-h-[232px] flex flex-col rounded-lg border border-divider bg-surface"
      >
        <header class="flex items-center gap-2 px-3 pt-3 pb-2">
          <span class="w-2 h-2 rounded-full" :class="column.value.tone" />
          <h3 class="font-semibold text-sm text-on-surface">{{ column.value.title }}</h3>
          <span class="ml-auto text-xs text-on-surface-variant">{{ column.items.size }}</span>
        </header>

        <ul v-if="(view.items.get(column.id)?.values.length ?? 0) > 0" class="flex flex-col gap-2 px-3 pb-3">
          <li
            v-for="item in view.items.get(column.id)?.values ?? []"
            :key="item.id"
            class="group rounded-md border border-divider bg-surface-tint px-3 py-2 text-sm"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="font-medium truncate">{{ item.value.title }}</div>
                <div class="text-xs text-on-surface-variant">{{ item.value.assignee }}</div>
              </div>

              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  aria-label="Move to previous column"
                  class="rounded px-1.5 py-0.5 text-xs hover:bg-surface-variant disabled:opacity-30 disabled:hover:bg-transparent"
                  :disabled="column.id === view.columns.values[0]?.id"
                  @click="previous(item.id, column.id)"
                >
                  ←
                </button>

                <button
                  aria-label="Move to next column"
                  class="rounded px-1.5 py-0.5 text-xs hover:bg-surface-variant disabled:opacity-30 disabled:hover:bg-transparent"
                  :disabled="column.id === view.columns.values[view.columns.values.length - 1]?.id"
                  @click="next(item.id, column.id)"
                >
                  →
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div v-else class="flex-1 px-3 pb-3 text-xs text-on-surface-variant italic">
          No cards
        </div>
      </div>
    </div>

    <p class="text-xs text-on-surface-variant min-h-4">
      <span v-if="status">{{ status }}</span>
      <span v-else class="opacity-60">Hover a card and click → to transfer it.</span>
    </p>
  </div>
</template>
