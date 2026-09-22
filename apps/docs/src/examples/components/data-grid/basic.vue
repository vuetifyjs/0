<script setup lang="ts">
  import { Button, DataGrid, Input } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  interface User {
    id: number
    name: string
    email: string
    role: string
  }

  const query = shallowRef('')

  const users: User[] = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer' },
  ]

  const columns = [
    { id: 'name', title: 'Name', size: 34, minSize: 16, sortable: true, filterable: false },
    { id: 'email', title: 'Email', size: 42, minSize: 20, sortable: true, filterable: true },
    { id: 'role', title: 'Role', size: 24, minSize: 12, sortable: true, filterable: false },
  ] as const
</script>

<template>
  <DataGrid.Root v-model:search="query">
    <div class="mb-4">
      <Input.Root v-model="query" label="Search users">
        <Input.Control
          class="border rounded-md px-3 py-2 w-64"
          placeholder="Search..."
        />
      </Input.Root>
    </div>

    <DataGrid.Table
      aria-label="Users"
      as="div"
      class="w-full border border-divider rounded-lg overflow-hidden"
    >
      <DataGrid.Header as="div" class="bg-surface-tint">
        <DataGrid.Row as="div" class="flex" resizable>
          <DataGrid.Column
            v-for="(col, i) in columns"
            :id="col.id"
            :key="col.id"
            v-slot="{ isSortable, toggle, direction }"
            as="div"
            class="relative p-3 text-start font-semibold"
            :filterable="col.filterable"
            :min-size="col.minSize"
            :size="col.size"
            :sortable="col.sortable"
          >
            <Button.Root
              v-if="isSortable"
              class="flex items-center gap-1 hover:text-primary"
              @click="toggle"
            >
              {{ col.title }}
              <span v-if="direction !== 'none'" class="text-xs font-normal opacity-60">{{ direction }}</span>
            </Button.Root>

            <span v-else>{{ col.title }}</span>

            <DataGrid.Handle
              v-if="i < columns.length - 1"
              class="absolute inset-y-0 right-0 z-10 group"
              :label="'Resize ' + col.title"
            >
              <div class="absolute inset-y-0 -left-1 w-2 cursor-col-resize flex justify-center">
                <div class="w-px h-full bg-divider group-hover:w-0.5 group-hover:bg-primary group-data-[state=drag]:w-0.5 group-data-[state=drag]:bg-primary" />
              </div>
            </DataGrid.Handle>
          </DataGrid.Column>
        </DataGrid.Row>
      </DataGrid.Header>

      <DataGrid.Body v-slot="{ rank }" as="div">
        <DataGrid.Row
          v-for="user in rank(users)"
          :id="user.id"
          :key="user.id"
          as="div"
          class="flex hover:bg-surface-tint/50 border-t border-divider"
          :value="user"
        >
          <DataGrid.Cell
            v-for="(col, i) in columns"
            :key="col.id"
            as="div"
            class="p-3 truncate"
            :class="i < columns.length - 1 ? 'border-e border-divider' : undefined"
            :column="col.id"
          >
            {{ user[col.id] }}
          </DataGrid.Cell>
        </DataGrid.Row>

        <DataGrid.Empty v-slot="{ columnCount }" as="div">
          <DataGrid.Cell
            as="div"
            class="grow w-full basis-full p-6 text-center text-on-surface-variant"
            :colspan="columnCount"
          >
            No users found
          </DataGrid.Cell>
        </DataGrid.Empty>
      </DataGrid.Body>
    </DataGrid.Table>
  </DataGrid.Root>
</template>
