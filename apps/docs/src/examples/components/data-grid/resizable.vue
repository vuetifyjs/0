<script setup lang="ts">
  import { DataGrid, Splitter } from '@vuetify/v0'

  interface User {
    id: number
    name: string
    email: string
    role: string
  }

  const users: User[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
  ]

  const columns = [
    { id: 'name', size: 30, minSize: 15, resizable: true },
    { id: 'email', size: 45, minSize: 20, resizable: true },
    { id: 'role', size: 25, minSize: 10, resizable: true },
  ]
</script>

<template>
  <DataGrid.Root v-slot="{ context }">
    <div
      aria-label="Users"
      class="w-full border border-divider rounded-lg overflow-hidden"
      role="grid"
      @vue:mounted="context.columns.onboard(columns)"
    >
      <!-- Resizable header using Splitter composition -->
      <div class="bg-surface-tint" role="rowgroup">
        <Splitter.Root
          class="flex"
          orientation="horizontal"
          role="row"
          @layout="(sizes: number[]) => context.layout.distribute(sizes)"
        >
          <Splitter.Panel
            v-for="(col, idx) in columns"
            :key="col.id"
            class="p-3 text-start font-semibold relative"
            :default-size="col.size"
            :min-size="col.minSize"
            role="columnheader"
          >
            <span class="block truncate">
              {{ col.id.charAt(0).toUpperCase() + col.id.slice(1) }}
            </span>

            <Splitter.Handle
              v-if="idx < columns.length - 1"
              class="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-primary/50 data-[state=drag]:bg-primary z-10"
              :label="`Resize ${col.id} column`"
            />
          </Splitter.Panel>
        </Splitter.Root>
      </div>

      <!-- Body rows with widths synced from layout -->
      <div
        role="rowgroup"
        @vue:mounted="context.onboard(users.map(u => ({ id: u.id, value: u })))"
      >
        <div
          v-for="item in context.items.value"
          :key="item.id"
          class="flex hover:bg-surface-tint/50 border-t border-divider"
          role="row"
        >
          <div
            v-for="col in columns"
            :key="col.id"
            class="p-3 truncate"
            role="gridcell"
            :style="{
              flexBasis: `${context.layout.columns.value.find((c: any) => c.id === col.id)?.size ?? 0}%`,
              flexGrow: 0,
              flexShrink: 0,
            }"
          >
            {{ (item as any)[col.id] }}
          </div>
        </div>
      </div>
    </div>
  </DataGrid.Root>
</template>
