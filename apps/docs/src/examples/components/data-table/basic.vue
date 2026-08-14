<script setup lang="ts">
  import { defineComponent, onMounted } from 'vue'

  import { DataTable, useDataTableRoot } from '@vuetify/v0'

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
    { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Editor' },
    { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Admin' },
  ]

  const columns = [
    { id: 'name', title: 'Name', sortable: true },
    { id: 'email', title: 'Email', sortable: true, filterable: true },
    { id: 'role', title: 'Role', sortable: true },
  ]

  // One-shot initialization component
  const DataTableInit = defineComponent({
    name: 'DataTableInit',
    setup () {
      const context = useDataTableRoot('v0:data-table')
      onMounted(() => {
        context.columns.onboard(columns)
        context.onboard(users.map(u => ({ id: u.id, value: u })))
      })
      return () => null
    },
  })
</script>

<template>
  <DataTable.Root v-slot="{ context }">
    <DataTableInit />

    <div class="mb-4">
      <input
        class="border rounded-md px-3 py-2 w-64"
        placeholder="Search..."
        type="text"
        @input="(e) => context.search((e.target as HTMLInputElement).value)"
      >
    </div>

    <DataTable.Table class="w-full border-collapse">
      <DataTable.Head>
        <DataTable.HeaderRow class="border-b">
          <DataTable.HeaderCell
            v-for="col in columns"
            :key="col.id"
            v-slot="{ isSortable, sortDirection, toggleSort }"
            class="text-left p-3 font-semibold"
            :column-id="col.id"
          >
            <button
              v-if="isSortable"
              class="flex items-center gap-1 hover:text-primary"
              @click="toggleSort"
            >
              {{ col.title }}
              <span v-if="sortDirection === 'asc'">▲</span>
              <span v-else-if="sortDirection === 'desc'">▼</span>
              <span v-else class="opacity-30">⇅</span>
            </button>

            <span v-else>{{ col.title }}</span>
          </DataTable.HeaderCell>
        </DataTable.HeaderRow>
      </DataTable.Head>

      <DataTable.Body v-slot="{ items }">
        <DataTable.Row
          v-for="item in items"
          :key="(item as User).id"
          class="border-b hover:bg-surface-variant"
          :row-id="(item as User).id"
        >
          <DataTable.Cell class="p-3">{{ (item as User).name }}</DataTable.Cell>
          <DataTable.Cell class="p-3">{{ (item as User).email }}</DataTable.Cell>
          <DataTable.Cell class="p-3">{{ (item as User).role }}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Empty>
          <DataTable.Cell class="p-6 text-center text-on-surface-variant" :colspan="3">
            No users found
          </DataTable.Cell>
        </DataTable.Empty>
      </DataTable.Body>
    </DataTable.Table>
  </DataTable.Root>
</template>
