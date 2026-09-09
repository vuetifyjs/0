<script setup lang="ts">
  import { Button } from '../Button/index'
  import { DataGrid } from '../DataGrid/index'

  interface User {
    id: number
    name: string
    email: string
  }

  const users: User[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ]

  const columns = [
    { id: 'name', title: 'Name', sortable: true },
    { id: 'email', title: 'Email', sortable: true },
  ]
</script>

<template>
  <DataGrid.Root>
    <DataGrid.Table aria-label="Users">
      <DataGrid.Header>
        <DataGrid.Row>
          <DataGrid.Column
            v-for="col in columns"
            :id="col.id"
            :key="col.id"
            v-slot="{ isSortable, toggle }"
            :sortable="true"
          >
            <Button.Root v-if="isSortable" @click="toggle">
              {{ col.title }}
            </Button.Root>

            <span v-else>{{ col.title }}</span>
          </DataGrid.Column>
        </DataGrid.Row>
      </DataGrid.Header>

      <DataGrid.Body v-slot="{ rank }">
        <DataGrid.Row
          v-for="user in rank(users)"
          :id="user.id"
          :key="user.id"
          :value="user"
        >
          <DataGrid.Cell column="name">{{ user.name }}</DataGrid.Cell>
          <DataGrid.Cell column="email">{{ user.email }}</DataGrid.Cell>
        </DataGrid.Row>

        <DataGrid.Empty v-slot="{ columnCount }">
          <DataGrid.Cell :colspan="columnCount" column="name">
            No users found
          </DataGrid.Cell>
        </DataGrid.Empty>
      </DataGrid.Body>
    </DataGrid.Table>
  </DataGrid.Root>
</template>
