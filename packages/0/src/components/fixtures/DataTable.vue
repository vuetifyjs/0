<script setup lang="ts">
  import { DataTable } from '../DataTable/index'

  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ]

  const columns = [
    { id: 'name', title: 'Name', sortable: true },
    { id: 'email', title: 'Email', sortable: true },
  ]
</script>

<template>
  <DataTable.Root v-slot="{ context }" aria-label="Users table">
    <div v-once>
      {{ void context.columns.onboard(columns) }}
      {{ void context.onboard(users.map(u => ({ id: u.id, value: u }))) }}
    </div>

    <DataTable.Table>
      <DataTable.Head>
        <DataTable.HeaderRow>
          <DataTable.HeaderCell
            v-for="col in columns"
            :key="col.id"
            :column-id="col.id"
          >
            {{ col.title }}
          </DataTable.HeaderCell>
        </DataTable.HeaderRow>
      </DataTable.Head>

      <DataTable.Body v-slot="{ items }">
        <DataTable.Row
          v-for="item in items"
          :key="(item as any).id"
          :row-id="(item as any).id"
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
