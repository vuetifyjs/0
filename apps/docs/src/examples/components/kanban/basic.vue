<script setup lang="ts">
  import { Kanban } from '@vuetify/v0'
  import { ref } from 'vue'

  interface Card {
    id: number
    title: string
  }

  const columns = [
    { id: 'todo', label: 'Todo' },
    { id: 'doing', label: 'Doing' },
    { id: 'done', label: 'Done' },
  ]

  const board = ref<Record<string, Card[]>>({
    todo: [
      { id: 1, title: 'Write the spec' },
      { id: 2, title: 'Sketch the layout' },
      { id: 3, title: 'Pick a palette' },
    ],
    doing: [
      { id: 4, title: 'Build the board' },
    ],
    done: [
      { id: 5, title: 'Kickoff meeting' },
    ],
  })
</script>

<template>
  <Kanban.Root class="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3" label="Project board">
    <Kanban.Column
      v-for="column in columns"
      :id="column.id"
      :key="column.id"
      v-slot="{ items }"
      v-model="board[column.id]"
      class="flex flex-col gap-2 rounded-lg border border-divider bg-surface p-2"
      :label="column.label"
    >
      <div class="flex items-center justify-between px-1 text-sm font-semibold">
        {{ column.label }}
        <span class="text-xs font-normal text-on-surface-variant">{{ items.length }}</span>
      </div>

      <Kanban.List class="flex min-h-24 flex-col gap-2 rounded-md p-1 data-[over]:bg-surface-tint data-[target]:bg-surface-tint">
        <Kanban.Item
          v-for="card in items"
          :key="card.id"
          class="cursor-grab touch-none select-none rounded-md border-2 border-divider bg-surface px-3 py-2 data-[drop=after]:border-b-primary data-[drop=before]:border-t-primary text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary data-[state=dragging]:opacity-40 data-[state=grabbed]:border-primary data-[state=grabbed]:ring-2 data-[state=grabbed]:ring-primary"
          :label="card.title"
          :value="card"
        >
          {{ card.title }}
        </Kanban.Item>
      </Kanban.List>
    </Kanban.Column>

    <Kanban.Instructions class="sr-only" />
    <Kanban.LiveRegion class="sr-only" />
  </Kanban.Root>
</template>
