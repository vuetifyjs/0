<script setup lang="ts">
  // Utilities
  import { defineComponent } from 'vue'

  import { DataGrid, useDataGridRoot } from '../DataGrid/index'

  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ]

  const columns = [
    { id: 'name' },
    { id: 'email' },
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
  <DataGrid.Root>
    <DataGridInit />

    <DataGrid.Table aria-label="Users">
      <DataGrid.Header>
        <DataGrid.Row>
          <DataGrid.Column id="name">Name</DataGrid.Column>
          <DataGrid.Column id="email">Email</DataGrid.Column>
        </DataGrid.Row>
      </DataGrid.Header>

      <DataGrid.Body>
        <DataGrid.Row
          v-for="item in users"
          :id="item.id"
          :key="item.id"
        >
          <DataGrid.Cell column="name">{{ item.name }}</DataGrid.Cell>
          <DataGrid.Cell column="email">{{ item.email }}</DataGrid.Cell>
        </DataGrid.Row>
      </DataGrid.Body>
    </DataGrid.Table>
  </DataGrid.Root>
</template>
