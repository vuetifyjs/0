<script setup lang="ts">
  // Utilities
  import { defineComponent } from 'vue'

  import { DataTable, useDataTableRoot } from '../DataTable/index'

  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ]

  const columns = [
    { id: 'name', title: 'Name', sortable: true },
    { id: 'email', title: 'Email', sortable: true },
  ]

  const DataTableInit = defineComponent({
    name: 'DataTableInit',
    setup () {
      const context = useDataTableRoot('v0:data-table')
      context.columns.onboard(columns)
      context.onboard(users.map(u => ({ id: u.id, value: u })))
      return () => null
    },
  })
</script>

<template>
  <DataTable.Root>
    <DataTableInit />

    <DataTable.Table aria-label="Users table">
      <DataTable.Header>
        <DataTable.Row>
          <DataTable.Column
            v-for="col in columns"
            :id="col.id"
            :key="col.id"
          >
            {{ col.title }}
          </DataTable.Column>
        </DataTable.Row>
      </DataTable.Header>

      <DataTable.Body v-slot="{ items }">
        <DataTable.Row
          v-for="item in items"
          :id="(item as any).id"
          :key="(item as any).id"
        >
          <DataTable.Cell>{{ (item as any).name }}</DataTable.Cell>
          <DataTable.Cell>{{ (item as any).email }}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Empty>
          <DataTable.Cell :colspan="2">
            No users found
          </DataTable.Cell>
        </DataTable.Empty>
      </DataTable.Body>
    </DataTable.Table>
  </DataTable.Root>
</template>
