<script setup lang="ts">
  import { Kanban } from '@vuetify/v0'
  import { ref } from 'vue'

  const limit = 2

  const backlog = ref(['Audit routes', 'Update deps', 'Write tests'])
  const doing = ref(['Fix login bug'])
  const shipped = ref(['Release 1.2'])

  function accept () {
    return doing.value.length < limit
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <Kanban.Root class="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3" label="Release board">
      <Kanban.Column
        id="backlog"
        v-slot="{ items }"
        v-model="backlog"
        class="flex flex-col gap-2 rounded-lg border border-divider p-2"
        label="Backlog"
      >
        <div class="px-1 text-sm font-semibold">Backlog</div>

        <Kanban.List class="flex min-h-24 flex-col gap-2 rounded-md p-1 data-[over]:bg-surface-tint">
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
        id="doing"
        v-slot="{ items }"
        v-model="doing"
        :accept
        class="flex flex-col gap-2 rounded-lg border border-divider p-2"
        label="Doing"
      >
        <div class="flex justify-between px-1 text-sm font-semibold">
          Doing
          <span class="text-xs font-normal text-on-surface-variant">{{ items.length }} / {{ limit }}</span>
        </div>

        <Kanban.List class="flex min-h-24 flex-col gap-2 rounded-md p-1 data-[over]:bg-surface-tint">
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
        id="shipped"
        v-slot="{ items }"
        v-model="shipped"
        class="flex flex-col gap-2 rounded-lg border border-divider p-2 data-[disabled]:opacity-60"
        disabled
        label="Shipped"
      >
        <div class="px-1 text-sm font-semibold">Shipped (locked)</div>

        <Kanban.List class="flex min-h-24 flex-col gap-2 rounded-md p-1">
          <Kanban.Item
            v-for="item in items"
            :key="item"
            class="rounded-md border border-divider bg-surface px-3 py-2 text-sm"
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
      Doing accepts at most {{ limit }} items; Shipped is locked.
    </p>
  </div>
</template>
