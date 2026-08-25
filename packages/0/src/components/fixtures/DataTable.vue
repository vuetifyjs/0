<script setup lang="ts">
  import { DataTable } from '../DataTable/index'

  interface User extends Record<string, unknown> {
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
  <DataTable.Root>
    <DataTable.Table aria-label="Users table">
      <DataTable.Header>
        <DataTable.Row>
          <DataTable.Column
            v-for="col in columns"
            :id="col.id"
            :key="col.id"
            v-slot="{ isSortable, toggle }"
            :sortable="true"
          >
            <button v-if="isSortable" @click="toggle">
              {{ col.title }}
            </button>

            <span v-else>{{ col.title }}</span>
          </DataTable.Column>
        </DataTable.Row>
      </DataTable.Header>

      <DataTable.Body v-slot="{ rank }">
        <DataTable.Row
          v-for="user in rank(users)"
          :id="user.id"
          :key="user.id"
          :value="user"
        >
          <DataTable.Cell>{{ user.name }}</DataTable.Cell>
          <DataTable.Cell>{{ user.email }}</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Empty v-slot="{ columnCount }">
          <DataTable.Cell :colspan="columnCount">
            No users found
          </DataTable.Cell>
        </DataTable.Empty>
      </DataTable.Body>
    </DataTable.Table>
  </DataTable.Root>
</template>
