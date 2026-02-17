<script setup lang="ts">
  import { createDataTable, VirtualAdapter, createVirtual } from '@vuetify/v0'
  import { computed } from 'vue'
  import { columns } from './columns'
  import { generateUsers } from './data'

  const items = generateUsers(1000)

  const table = createDataTable({
    items,
    columns,
    adapter: new VirtualAdapter(),
  })

  const virtual = createVirtual(table.items, { itemHeight: 40 })
  const {
    element,
    items: virtualItems,
    offset,
    size,
    scroll,
  } = virtual

  const stats = computed(() => ({
    total: items.length,
    filtered: table.items.value.length,
    rendered: virtualItems.value.length,
  }))

  function sortIcon (key: string) {
    const dir = table.sort.direction(key)
    if (dir === 'asc') return '\u25B2'
    if (dir === 'desc') return '\u25BC'
    return '\u25BD'
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex gap-2 items-center">
      <input
        class="flex-1 px-3 py-2 border border-divider bg-surface text-on-surface rounded-lg focus:border-primary focus:outline-none"
        placeholder="Search 1,000 items..."
        type="text"
        :value="table.query.value"
        @input="table.search(($event.target as HTMLInputElement).value)"
      >

      <span class="text-sm opacity-60">
        {{ stats.rendered }} rendered / {{ stats.filtered }} filtered / {{ stats.total }} total
      </span>
    </div>

    <div
      ref="element"
      class="h-[300px] overflow-y-auto border border-divider rounded-lg"
      @scroll="scroll"
    >
      <table class="w-full text-sm">
        <thead class="sticky top-0 z-10 bg-surface">
          <tr class="border-b border-divider bg-surface-tint">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-3 text-left font-medium cursor-pointer select-none hover:text-primary transition-colors"
              @click="table.sort.toggle(col.key)"
            >
              {{ col.title }}
              <span class="ml-1 text-xs opacity-50">{{ sortIcon(col.key) }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr :style="{ height: `${offset}px` }" />

          <tr
            v-for="item in virtualItems"
            :key="item.raw.id"
            class="h-[40px] hover:bg-surface-tint transition-colors"
          >
            <td class="px-4">{{ item.raw.name }}</td>
            <td class="px-4 opacity-70">{{ item.raw.email }}</td>
            <td class="px-4 font-mono">{{ item.raw.score }}</td>
          </tr>

          <tr :style="{ height: `${size}px` }" />
        </tbody>
      </table>
    </div>
  </div>
</template>
