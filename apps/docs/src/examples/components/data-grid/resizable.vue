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
    { id: 'name', size: 30, minSize: 15, resizable: true },
    { id: 'email', size: 45, minSize: 20, resizable: true },
    { id: 'role', size: 25, minSize: 10, resizable: true },
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
    <DataGrid.Table
      as="div"
      class="w-full border border-divider rounded-lg overflow-hidden"
    >
      <DataGrid.Header as="div" class="bg-surface-tint">
        <!-- Resizable row: composes Splitter.Root internally -->
        <DataGrid.Row class="flex" resizable>
          <template v-for="(col, idx) in columns" :key="col.id">
            <!-- Column composes Splitter.Panel when in resizable row -->
            <DataGrid.Column
              class="p-3 text-start font-semibold relative"
              :column="col.id"
            >
              <span class="block truncate">
                {{ col.id.charAt(0).toUpperCase() + col.id.slice(1) }}
              </span>
            </DataGrid.Column>

            <!-- Handle composes Splitter.Handle -->
            <DataGrid.Handle
              v-if="idx < columns.length - 1"
              v-slot="{ state }"
              class="w-1 cursor-col-resize bg-transparent hover:bg-primary/50 z-10"
              :class="{ 'bg-primary': state === 'drag' }"
            />
          </template>
        </DataGrid.Row>
      </DataGrid.Header>

      <DataGrid.Body as="div">
        <DataGrid.Row
          v-for="item in context.items.value"
          :id="item.id"
          :key="item.id"
          class="flex hover:bg-surface-tint/50 border-t border-divider"
        >
          <DataGrid.Cell
            v-for="col in columns"
            :key="col.id"
            as="div"
            class="p-3 truncate"
            :column="col.id"
            :style="{
              flexBasis: `${context.layout.columns.value.find((c: any) => c.id === col.id)?.size ?? 0}%`,
              flexGrow: 0,
              flexShrink: 0,
            }"
          >
            {{ (item as any)[col.id] }}
          </DataGrid.Cell>
        </DataGrid.Row>
      </DataGrid.Body>
    </DataGrid.Table>
  </DataGrid.Root>
</template>
