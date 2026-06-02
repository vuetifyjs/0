<script setup lang="ts">
  import { mdiChevronDown, mdiChevronLeft, mdiChevronRight, mdiChevronUp } from '@mdi/js'
  import { Button, createKanban } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  import { useKanbanView } from './useKanbanView'

  import type { ID } from '@vuetify/v0'
  import type { Card, Column } from './types'

  const kanban = createKanban<Card, Column>()

  const todo = kanban.columns.register({ value: { title: 'Todo', tone: 'bg-on-surface-variant' } })
  const doing = kanban.columns.register({ value: { title: 'Doing', tone: 'bg-info' } })
  kanban.columns.register({ value: { title: 'Done', tone: 'bg-success' } })

  todo.items.register({ value: { title: 'Write spec', assignee: 'Maria' } })
  todo.items.register({ value: { title: 'Write plan', assignee: 'John' } })
  todo.items.register({ value: { title: 'Review PRs', assignee: 'Alex' } })
  todo.items.register({ value: { title: 'Refine onboarding', assignee: 'Sam' } })
  doing.items.register({ value: { title: 'Implement', assignee: 'Maria' } })
  doing.items.register({ value: { title: 'Polish UI', assignee: 'Alex' } })

  const view = useKanbanView(kanban)

  const selected = shallowRef<ID | null>(null)

  const selectedColumn = toRef(() => {
    if (!selected.value) return null
    return view.columns.values.find(col => col.items.has(selected.value!)) ?? null
  })

  const selectedTicket = toRef(() => {
    if (!selectedColumn.value || !selected.value) return null
    return selectedColumn.value.items.get(selected.value) ?? null
  })

  function onSelect (id: ID) {
    selected.value = selected.value === id ? null : id
  }

  const status = shallowRef('')
  kanban.on('transfer:ticket', ({ ticket, from, to }) => {
    const fromName = kanban.columns.get(from)?.value.title ?? '?'
    const toName = kanban.columns.get(to)?.value.title ?? '?'
    status.value = `Moved "${ticket.value.title}" from ${fromName} to ${toName}`
  })

  function next (): void {
    if (!selected.value || !selectedColumn.value) return
    const target = view.columns.values[selectedColumn.value.index + 1]
    if (target) kanban.transfer(selected.value, target.id, target.items.size)
  }

  function previous (): void {
    if (!selected.value || !selectedColumn.value) return
    const target = view.columns.values[selectedColumn.value.index - 1]
    if (target) kanban.transfer(selected.value, target.id, target.items.size)
  }

  function up (): void {
    if (!selected.value || !selectedColumn.value || !selectedTicket.value) return
    if (selectedTicket.value.index === 0) return
    selectedColumn.value.items.move(selected.value, selectedTicket.value.index - 1)
  }

  function down (): void {
    if (!selected.value || !selectedColumn.value || !selectedTicket.value) return
    if (selectedTicket.value.index === selectedColumn.value.items.size - 1) return
    selectedColumn.value.items.move(selected.value, selectedTicket.value.index + 1)
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2 rounded-lg border border-divider bg-surface px-3 py-2">
      <span class="flex-1 text-sm text-on-surface-variant">
        <template v-if="selected && selectedColumn">
          <span class="font-medium text-on-surface">{{ selectedTicket?.value.title }}</span>
          <span class="ml-1">in {{ selectedColumn.value.title }}</span>
        </template>

        <span v-else class="opacity-60">Select a card to move it</span>
      </span>

      <Button.Root
        aria-label="Move to previous column"
        class="inline-flex items-center justify-center rounded p-1 hover:bg-surface-variant data-disabled:opacity-30 data-disabled:hover:bg-transparent"
        :disabled="!selected || selectedColumn?.index === 0"
        @click="previous"
      >
        <Button.Icon>
          <svg class="size-4" viewBox="0 0 24 24"><path :d="mdiChevronLeft" fill="currentColor" /></svg>
        </Button.Icon>
      </Button.Root>

      <Button.Root
        aria-label="Move up within column"
        class="inline-flex items-center justify-center rounded p-1 hover:bg-surface-variant data-disabled:opacity-30 data-disabled:hover:bg-transparent"
        :disabled="!selected || selectedTicket?.index === 0"
        @click="up"
      >
        <Button.Icon>
          <svg class="size-4" viewBox="0 0 24 24"><path :d="mdiChevronUp" fill="currentColor" /></svg>
        </Button.Icon>
      </Button.Root>

      <Button.Root
        aria-label="Move down within column"
        class="inline-flex items-center justify-center rounded p-1 hover:bg-surface-variant data-disabled:opacity-30 data-disabled:hover:bg-transparent"
        :disabled="!selected || selectedTicket?.index === selectedColumn!.items.size - 1"
        @click="down"
      >
        <Button.Icon>
          <svg class="size-4" viewBox="0 0 24 24"><path :d="mdiChevronDown" fill="currentColor" /></svg>
        </Button.Icon>
      </Button.Root>

      <Button.Root
        aria-label="Move to next column"
        class="inline-flex items-center justify-center rounded p-1 hover:bg-surface-variant data-disabled:opacity-30 data-disabled:hover:bg-transparent"
        :disabled="!selected || selectedColumn?.index === view.columns.size - 1"
        @click="next"
      >
        <Button.Icon>
          <svg class="size-4" viewBox="0 0 24 24"><path :d="mdiChevronRight" fill="currentColor" /></svg>
        </Button.Icon>
      </Button.Root>
    </div>

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

        <ul v-if="column.items.size > 0" class="flex flex-col gap-2 px-3 pb-3">
          <li
            v-for="item in view.items.get(column.id)?.values ?? []"
            :key="item.id"
            class="cursor-pointer rounded-md border px-3 py-2 text-sm transition-colors"
            :class="item.id === selected
              ? 'border-primary bg-primary/10'
              : 'border-divider bg-surface-tint hover:border-primary/40'"
            @click="onSelect(item.id)"
          >
            <div class="font-medium">{{ item.value.title }}</div>
            <div class="text-xs text-on-surface-variant">{{ item.value.assignee }}</div>
          </li>
        </ul>

        <div v-else class="flex-1 px-3 pb-3 text-xs text-on-surface-variant italic">
          No cards
        </div>
      </div>
    </div>

    <p class="text-xs text-on-surface-variant min-h-4">
      <span v-if="status">{{ status }}</span>
      <span v-else class="opacity-60">Click a card to select it, then use the controls above to move it.</span>
    </p>
  </div>
</template>
