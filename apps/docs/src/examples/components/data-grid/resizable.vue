<script setup lang="ts">
  import { DataGrid, useDataGridRoot } from '@vuetify/v0'
  import { defineComponent } from 'vue'

  interface User {
    id: number
    name: string
    email: string
    role: string
  }

  type UserColumn = Exclude<keyof User, 'id'>

  const users: User[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
  ]

  const columns: { id: UserColumn, size: number, minSize: number, resizable: boolean }[] = [
    { id: 'name', size: 30, minSize: 15, resizable: true },
    { id: 'email', size: 45, minSize: 20, resizable: true },
    { id: 'role', size: 25, minSize: 10, resizable: true },
  ]

  const DataGridInit = defineComponent({
    name: 'DataGridInit',
    setup () {
      const context = useDataGridRoot('v0:data-grid')
      if (context.columns.size === 0) {
        context.columns.onboard(columns)
        context.onboard(users.map(u => ({ id: u.id, value: u })))
      }
      return () => null
    },
  })
</script>

<template>
  <DataGrid.Root v-slot="{ context }">
    <DataGridInit />

    <DataGrid.Table
      as="div"
      class="w-full border border-divider rounded-lg overflow-hidden"
    >
      <DataGrid.Header as="div" class="bg-surface-tint">
        <DataGrid.Row class="flex" resizable>
          <template v-for="(col, idx) in columns" :key="col.id">
            <DataGrid.Column
              :id="col.id"
              class="p-3 text-start font-semibold relative"
            >
              <span class="block truncate">
                {{ col.id.charAt(0).toUpperCase() + col.id.slice(1) }}
              </span>
            </DataGrid.Column>

            <DataGrid.Handle
              v-if="idx < columns.length - 1"
              v-slot="{ state }"
              class="w-1 cursor-col-resize bg-transparent hover:bg-primary/50 z-10"
              :class="{ 'bg-primary': state === 'drag' }"
            />
          </template>
        </DataGrid.Row>
      </DataGrid.Header>

      <DataGrid.Body as="div">
        <DataGrid.Row
          v-for="item in context.items.value"
          :id="item.id"
          :key="item.id"
          class="flex hover:bg-surface-tint/50 border-t border-divider"
        >
          <DataGrid.Cell
            v-for="col in columns"
            :key="col.id"
            as="div"
            class="p-3 truncate"
            :column="col.id"
            :style="{
              flexBasis: `${context.layout.columns.value.find(c => c.id === col.id)?.size ?? 0}%`,
              flexGrow: 0,
              flexShrink: 0,
            }"
          >
            {{ item[col.id] }}
          </DataGrid.Cell>
        </DataGrid.Row>
      </DataGrid.Body>
    </DataGrid.Table>
  </DataGrid.Root>
</template>
