<script setup lang="ts">
  import { DataGrid } from '../DataGrid/index'

  interface User extends Record<string, unknown> {
    id: number
    name: string
    email: string
  }

  const users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ]

  function rows (ordered: readonly Record<string, unknown>[], size: number) {
    return (size > 0 ? ordered : users) as User[]
  }
</script>

<template>
  <DataGrid.Root>
    <DataGrid.Table aria-label="Users">
      <DataGrid.Header>
        <DataGrid.Row>
          <DataGrid.Column id="name">Name</DataGrid.Column>
          <DataGrid.Column id="email">Email</DataGrid.Column>
        </DataGrid.Row>
      </DataGrid.Header>

      <DataGrid.Body v-slot="{ orderedItems, headerRows, size }">
        <DataGrid.Row
          v-for="(user, i) in rows(orderedItems, size)"
          :id="user.id"
          :key="user.id"
          :index="headerRows + i + 1"
          :value="user"
        >
          <DataGrid.Cell column="name">{{ user.name }}</DataGrid.Cell>
          <DataGrid.Cell column="email">{{ user.email }}</DataGrid.Cell>
        </DataGrid.Row>
      </DataGrid.Body>
    </DataGrid.Table>
  </DataGrid.Root>
</template>
