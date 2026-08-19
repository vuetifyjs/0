<script setup lang="ts">
  import { DataGrid, useDataGridRoot } from '@vuetify/v0'
  import { defineComponent } from 'vue'

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
    { id: 'name' },
    { id: 'email' },
    { id: 'role' },
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

    <DataGrid.Table class="w-full border-collapse">
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

      <DataGrid.Body>
        <DataGrid.Row
          v-for="item in context.items.value"
          :id="item.id"
          :key="item.id"
          class="hover:bg-surface-tint/50"
        >
          <DataGrid.Cell class="p-3 border-b border-divider" column="name">
            {{ item.name }}
          </DataGrid.Cell>

          <DataGrid.Cell class="p-3 border-b border-divider" column="email">
            {{ item.email }}
          </DataGrid.Cell>

          <DataGrid.Cell class="p-3 border-b border-divider" column="role">
            {{ item.role }}
          </DataGrid.Cell>
        </DataGrid.Row>
      </DataGrid.Body>
    </DataGrid.Table>
  </DataGrid.Root>
</template>
