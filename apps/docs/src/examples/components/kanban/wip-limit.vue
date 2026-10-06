<script setup lang="ts">
  import { Kanban } from '@vuetify/v0'
  import { ref } from 'vue'

  const limit = 2

  const board = ref<Record<string, string[]>>({
    backlog: ['Audit routes', 'Update deps', 'Write tests'],
    doing: ['Fix login bug'],
    review: [],
    shipped: ['Release 1.2'],
  })

  const columns = [
    { id: 'backlog', label: 'Backlog' },
    { id: 'doing', label: 'Doing', accept: () => board.value.doing.length < limit },
    { id: 'review', label: 'Review' },
    { id: 'shipped', label: 'Shipped', disabled: true },
  ]
</script>

<template>
  <div class="flex flex-col gap-3">
    <Kanban.Root class="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3" label="Release board">
      <Kanban.Column
        v-for="column in columns"
        :id="column.id"
        :key="column.id"
        v-slot="{ items }"
        v-model="board[column.id]"
        :accept="column.accept"
        class="flex flex-col gap-2 rounded-lg border border-divider p-2 data-[disabled]:opacity-60 data-[target]:border-primary"
        :disabled="column.disabled"
        :label="column.label"
      >
        <div class="flex justify-between px-1 text-sm font-semibold">
          {{ column.label }}
          <span v-if="column.accept" class="text-xs font-normal text-on-surface-variant">{{ items.length }} / {{ limit }}</span>
          <span v-else-if="column.disabled" class="text-xs font-normal text-on-surface-variant">locked</span>
        </div>

        <Kanban.List class="flex min-h-24 flex-col gap-2 rounded-md p-1 data-[over]:bg-surface-tint data-[target]:bg-surface-tint">
          <Kanban.Item
            v-for="item in items"
            :key="item"
            class="cursor-grab touch-none select-none rounded-md border-2 border-divider bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary data-[disabled]:cursor-default data-[drop=after]:border-b-primary data-[drop=before]:border-t-primary data-[state=dragging]:opacity-40 data-[state=grabbed]:ring-2 data-[state=grabbed]:ring-primary"
            :value="item"
          >
            {{ item }}
          </Kanban.Item>
        </Kanban.List>
      </Kanban.Column>

      <Kanban.Instructions class="sr-only" />
      <Kanban.LiveRegion class="sr-only" />
    </Kanban.Root>

    <p class="text-xs text-on-surface-variant">
      Doing takes at most {{ limit }} items and Shipped is locked. With the keyboard, pick an item up with Space and press the right arrow: full or locked columns are skipped.
    </p>
  </div>
</template>
