<script setup lang="ts">
  import { DataGrid } from '@vuetify/v0'

  interface User extends Record<string, unknown> {
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
    { id: 'name' },
    { id: 'email' },
    { id: 'role' },
  ]

  function rows (ordered: readonly Record<string, unknown>[], size: number) {
    return (size > 0 ? ordered : users) as User[]
  }
</script>

<template>
  <DataGrid.Root>
    <DataGrid.Table aria-label="Users" class="w-full border-collapse">
      <DataGrid.Header>
        <DataGrid.Row class="bg-surface-tint">
          <DataGrid.Column
            v-for="col in columns"
            :id="col.id"
            :key="col.id"
            class="p-3 text-start font-semibold border-b border-divider"
          >
            {{ col.id.charAt(0).toUpperCase() + col.id.slice(1) }}
          </DataGrid.Column>
        </DataGrid.Row>
      </DataGrid.Header>

      <DataGrid.Body v-slot="{ items, orderedItems, headerRows, size }">
        <DataGrid.Row
          v-for="(user, i) in rows(orderedItems, size)"
          v-show="items.some(item => item.id === user.id)"
          :id="user.id"
          :key="user.id"
          class="hover:bg-surface-tint/50"
          :index="headerRows + i + 1"
          :value="user"
        >
          <DataGrid.Cell class="p-3 border-b border-divider" column="name">
            {{ user.name }}
          </DataGrid.Cell>

          <DataGrid.Cell class="p-3 border-b border-divider" column="email">
            {{ user.email }}
          </DataGrid.Cell>

          <DataGrid.Cell class="p-3 border-b border-divider" column="role">
            {{ user.role }}
          </DataGrid.Cell>
        </DataGrid.Row>
      </DataGrid.Body>
    </DataGrid.Table>
  </DataGrid.Root>
</template>
