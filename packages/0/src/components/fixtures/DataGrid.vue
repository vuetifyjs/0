<script setup lang="ts">
  import { DataGrid } from '../DataGrid/index'
</script>

<template>
  <DataGrid.Root v-slot="{ context }">
    <DataGrid.Table aria-label="Users">
      <DataGrid.Header>
        <DataGrid.Row>
          <DataGrid.Column id="name">Name</DataGrid.Column>
          <DataGrid.Column id="email">Email</DataGrid.Column>
        </DataGrid.Row>
      </DataGrid.Header>

      <DataGrid.Body
        @vue:mounted="context.onboard([
          { id: 1, value: { id: 1, name: 'Alice', email: 'alice@example.com' } },
          { id: 2, value: { id: 2, name: 'Bob', email: 'bob@example.com' } },
        ])"
      >
        <DataGrid.Row
          v-for="item in context.items.value"
          :id="(item as any).id"
          :key="(item as any).id"
        >
          <DataGrid.Cell column="name">{{ (item as any).name }}</DataGrid.Cell>
          <DataGrid.Cell column="email">{{ (item as any).email }}</DataGrid.Cell>
        </DataGrid.Row>
      </DataGrid.Body>
    </DataGrid.Table>
  </DataGrid.Root>
</template>
