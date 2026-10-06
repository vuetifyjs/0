<script setup lang="ts">
  import { Kanban } from '@vuetify/v0'
  import { ref, shallowRef } from 'vue'

  import type { KanbanMovePayload } from '@vuetify/v0'

  const open = ref(['Login fails on Safari', 'Typo in footer'])
  const closed = ref(['Broken avatar upload'])

  const log = shallowRef<string[]>([])

  function onMove ({ value, from, to, fromIndex, toIndex }: KanbanMovePayload) {
    const entry = from === to
      ? `"${value}" reordered in ${to}: ${fromIndex + 1} → ${toIndex + 1}`
      : `"${value}" moved ${from} → ${to} at ${toIndex + 1}`

    log.value = [entry, ...log.value].slice(0, 4)
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <Kanban.Root class="grid grid-cols-2 gap-3" label="Issues" @move="onMove">
      <Kanban.Column
        id="open"
        v-slot="{ items }"
        v-model="open"
        class="flex flex-col gap-2 rounded-lg border border-divider p-2"
        label="Open"
      >
        <div class="px-1 text-sm font-semibold">Open</div>

        <Kanban.List class="flex min-h-20 flex-col gap-2 rounded-md p-1 data-[over]:bg-surface-tint">
          <Kanban.Item
            v-for="item in items"
            :key="item"
            class="cursor-grab touch-none select-none rounded-md border border-divider bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary data-[state=grabbed]:ring-2 data-[state=grabbed]:ring-primary"
            :value="item"
          >
            {{ item }}
          </Kanban.Item>
        </Kanban.List>
      </Kanban.Column>

      <Kanban.Column
        id="closed"
        v-slot="{ items }"
        v-model="closed"
        class="flex flex-col gap-2 rounded-lg border border-divider p-2"
        label="Closed"
      >
        <div class="px-1 text-sm font-semibold">Closed</div>

        <Kanban.List class="flex min-h-20 flex-col gap-2 rounded-md p-1 data-[over]:bg-surface-tint">
          <Kanban.Item
            v-for="item in items"
            :key="item"
            class="cursor-grab touch-none select-none rounded-md border border-divider bg-surface px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary data-[state=grabbed]:ring-2 data-[state=grabbed]:ring-primary"
            :value="item"
          >
            {{ item }}
          </Kanban.Item>
        </Kanban.List>
      </Kanban.Column>

      <Kanban.Instructions class="sr-only" />
      <Kanban.LiveRegion class="sr-only" />
    </Kanban.Root>

    <ol class="m-0 flex flex-col gap-1 pl-4 text-xs text-on-surface-variant">
      <li v-if="log.length === 0">Move an item to see the event.</li>
      <li v-for="(entry, index) in log" :key="index">{{ entry }}</li>
    </ol>
  </div>
</template>
