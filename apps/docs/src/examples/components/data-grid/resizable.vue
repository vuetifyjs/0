<script setup lang="ts">
  import { DataGrid } from '@vuetify/v0'

  interface User extends Record<string, unknown> {
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

  function rows (ordered: readonly Record<string, unknown>[], size: number) {
    return (size > 0 ? ordered : users) as User[]
  }
</script>

<template>
  <DataGrid.Root>
    <DataGrid.Table
      aria-label="Users"
      as="div"
      class="w-full border border-divider rounded-lg overflow-hidden"
    >
      <DataGrid.Header as="div" class="bg-surface-tint">
        <DataGrid.Row as="div" class="flex" resizable>
          <template v-for="(col, idx) in columns" :key="col.id">
            <DataGrid.Column
              :id="col.id"
              as="div"
              class="p-3 text-start font-semibold relative"
              :min-size="col.minSize"
              :resizable="col.resizable"
              :size="col.size"
            >
              <span class="block truncate">
                {{ col.id.charAt(0).toUpperCase() + col.id.slice(1) }}
              </span>
            </DataGrid.Column>

            <DataGrid.Handle
              v-if="idx < columns.length - 1"
              class="w-1 cursor-col-resize bg-transparent hover:bg-primary/50 z-10 data-[state=drag]:bg-primary"
              :label="'Resize ' + col.id"
            />
          </template>
        </DataGrid.Row>
      </DataGrid.Header>

      <DataGrid.Body v-slot="{ items, orderedItems, headerRows, size }" as="div">
        <DataGrid.Row
          v-for="(user, i) in rows(orderedItems, size)"
          v-show="items.some(item => item.id === user.id)"
          :id="user.id"
          :key="user.id"
          as="div"
          class="flex hover:bg-surface-tint/50 border-t border-divider"
          :index="headerRows + i + 1"
          :value="user"
        >
          <DataGrid.Cell
            v-for="col in columns"
            :key="col.id"
            v-slot="{ size: width }"
            as="div"
            class="p-3 truncate"
            :column="col.id"
            :style="{
              flexBasis: `${width}%`,
              flexGrow: 0,
              flexShrink: 0,
            }"
          >
            {{ user[col.id] }}
          </DataGrid.Cell>
        </DataGrid.Row>
      </DataGrid.Body>
    </DataGrid.Table>
  </DataGrid.Root>
</template>
