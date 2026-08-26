<script setup lang="ts">
  import { Button, DataTable } from '@vuetify/v0'
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
    { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Editor' },
    { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Admin' },
  ]

  const columns = [
    { id: 'name', title: 'Name', sortable: true },
    { id: 'email', title: 'Email', sortable: true, filterable: true },
    { id: 'role', title: 'Role', sortable: true },
  ]

</script>

<template>
  <DataTable.Root v-model:search="query">
    <div class="mb-4">
      <input
        v-model="query"
        aria-label="Search users"
        class="border rounded-md px-3 py-2 w-64"
        placeholder="Search..."
        type="text"
      >
    </div>

    <DataTable.Table aria-label="Users table" class="w-full border-collapse">
      <DataTable.Header>
        <DataTable.Row class="border-b">
          <DataTable.Column
            v-for="col in columns"
            :id="col.id"
            :key="col.id"
            v-slot="{ isSortable, toggle, direction }"
            class="text-left p-3 font-semibold"
            :filterable="col.filterable"
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
          </DataTable.Column>
        </DataTable.Row>
      </DataTable.Header>

      <DataTable.Body v-slot="{ rank }">
        <DataTable.Row
          v-for="user in rank(users)"
          :id="user.id"
          :key="user.id"
          class="border-b hover:bg-surface-variant"
          :value="user"
        >
          <DataTable.Cell class="p-3">{{ user.name }}</DataTable.Cell>
          <DataTable.Cell class="p-3">{{ user.email }}</DataTable.Cell>
          <DataTable.Cell class="p-3">{{ user.role }}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Empty v-slot="{ columnCount }">
          <DataTable.Cell class="p-6 text-center text-on-surface-variant" :colspan="columnCount">
            No users found
          </DataTable.Cell>
        </DataTable.Empty>
      </DataTable.Body>
    </DataTable.Table>
  </DataTable.Root>
</template>
