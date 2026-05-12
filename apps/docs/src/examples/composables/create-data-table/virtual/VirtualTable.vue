<script setup lang="ts">
  import { createDataTable, VirtualDataTableAdapter, createVirtual } from '@vuetify/v0'
  import { computed } from 'vue'
  import { columns } from './columns'
  import { generate } from './data'

  const items = generate(1000)

  const table = createDataTable({
    columns,
    adapter: new VirtualDataTableAdapter(),
  })

  table.onboard(items.map(value => ({ id: value.id, value })))

  const virtual = createVirtual(table.items, { itemHeight: 40 })
  const {
    element,
    items: visible,
    offset,
    size,
    scroll,
  } = virtual

  const stats = computed(() => ({
    total: items.length,
    filtered: table.items.value.length,
    rendered: visible.value.length,
  }))

  function arrow (key: string) {
    const dir = table.sort.direction(key)
    if (dir === 'asc') return '↑'
    if (dir === 'desc') return '↓'
    return ''
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

    <div class="border border-divider rounded-lg overflow-clip">
      <div
        ref="element"
        class="h-[300px] overflow-y-auto"
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
                <span class="ml-1 text-xs opacity-50">{{ arrow(col.key) }}</span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr :style="{ height: `${offset}px` }" />

            <tr
              v-for="item in visible"
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
  </div>
</template>
