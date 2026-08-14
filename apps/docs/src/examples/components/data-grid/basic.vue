<script setup lang="ts">
  import { DataGrid } from '@vuetify/v0'
  import { onMounted, ref } from 'vue'

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

  const gridRef = ref<{ context: any } | null>(null)

  onMounted(() => {
    if (gridRef.value?.context) {
      gridRef.value.context.columns.onboard(columns)
      gridRef.value.context.onboard(users.map(u => ({ id: u.id, value: u })))
    }
  })
</script>

<template>
  <DataGrid.Root ref="gridRef" v-slot="{ context }">
    <DataGrid.Table class="w-full border-collapse">
      <DataGrid.Header>
        <DataGrid.Row class="bg-surface-tint">
          <DataGrid.Column
            v-for="col in columns"
            :key="col.id"
            class="p-3 text-start font-semibold border-b border-divider"
            :column="col.id"
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
