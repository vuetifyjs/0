<script setup lang="ts">
  import { DataGrid } from '@vuetify/v0'

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
    <DataGrid.Table
      class="w-full border-collapse"
      @vue:mounted="context.columns.onboard(columns)"
    >
      <DataGrid.Header>
        <DataGrid.Row class="bg-surface-tint">
          <template v-for="(col, idx) in columns" :key="col.id">
            <DataGrid.Column
              v-slot="{ size }"
              class="p-3 text-start font-semibold border-b border-divider relative"
              :column="col.id"
              :style="{ width: `${size}%` }"
            >
              {{ col.id.charAt(0).toUpperCase() + col.id.slice(1) }}
            </DataGrid.Column>

            <DataGrid.ResizeHandle
              v-if="idx < columns.length - 1"
              v-slot="{ isDragging, state }"
              class="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 z-10"
              :class="{ 'bg-primary': isDragging }"
              :column="col.id"
              :data-state="state"
            />
          </template>
        </DataGrid.Row>
      </DataGrid.Header>

      <DataGrid.Body @vue:mounted="context.onboard(users.map(u => ({ id: u.id, value: u })))">
        <DataGrid.Row
          v-for="item in context.items.value"
          :id="item.id"
          :key="item.id"
          class="hover:bg-surface-tint/50"
        >
          <DataGrid.Cell
            v-for="col in columns"
            :key="col.id"
            class="p-3 border-b border-divider"
            :column="col.id"
            :style="{ width: `${context.layout.columns.value.find(c => c.id === col.id)?.size ?? 0}%` }"
          >
            {{ (item as any)[col.id] }}
          </DataGrid.Cell>
        </DataGrid.Row>
      </DataGrid.Body>
    </DataGrid.Table>
  </DataGrid.Root>
</template>
