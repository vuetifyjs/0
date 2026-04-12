<script setup lang="ts">
  import { mdiArrowUp, mdiArrowDown } from '@mdi/js'
  import { createDataGrid } from '@vuetify/v0'
  import { columns } from './columns'
  import { projects } from './data'
  import type { Project } from './data'

  const grid = createDataGrid({
    items: projects,
    columns,
    pagination: { itemsPerPage: 5 },
  })

  function direction (key: string) {
    return grid.sort.direction(key)
  }

  function statusColor (status: Project['status']) {
    if (status === 'active') return 'bg-success/15 text-success'
    if (status === 'paused') return 'bg-warning/15 text-warning'
    return 'bg-on-surface/10 text-on-surface op-70'
  }

  function priorityColor (priority: Project['priority']) {
    if (priority === 'critical') return 'text-error'
    if (priority === 'high') return 'text-warning'
    if (priority === 'medium') return 'text-primary'
    return 'op-50'
  }

  function progressColor (value: number) {
    if (value > 70) return 'bg-success'
    if (value >= 30) return 'bg-warning'
    return 'bg-error'
  }
</script>

<template>
  <div class="flex flex-col gap-2">
    <input
      class="px-3 py-1.5 border border-divider bg-surface text-on-surface rounded text-sm focus:border-primary focus:outline-none"
      placeholder="Search projects..."
      type="text"
      :value="grid.query.value"
      @input="grid.search(($event.target as HTMLInputElement).value)"
    >

    <div class="border border-divider rounded overflow-hidden">
      <table class="w-full text-xs table-fixed">
        <thead>
          <tr class="border-b border-divider bg-surface-tint">
            <th
              v-for="col in grid.layout.columns.value"
              :key="col.key"
              class="px-3 py-2 text-left font-semibold text-on-surface/70 uppercase tracking-wider cursor-pointer select-none hover:text-primary transition-colors"
              :data-sort="direction(col.key)"
              :style="{ width: col.size + '%' }"
              @click="grid.sort.toggle(col.key)"
            >
              <span class="inline-flex items-center gap-1">
                {{ columns.find(c => c.key === col.key)?.title }}
                <svg v-if="direction(col.key) !== 'none'" class="size-3.5 inline-block" viewBox="0 0 24 24">
                  <path :d="direction(col.key) === 'asc' ? mdiArrowUp : mdiArrowDown" fill="currentColor" />
                </svg>
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in grid.items.value"
            :key="item.id"
            class="border-b border-divider/50 even:bg-surface-tint hover:bg-primary/5 transition-colors"
          >
            <td
              v-for="col in grid.layout.columns.value"
              :key="col.key"
              class="px-3 py-2"
              :style="{ width: col.size + '%' }"
            >
              <!-- Project name -->
              <template v-if="col.key === 'name'">
                <span class="font-medium text-on-surface">{{ item[col.key] }}</span>
              </template>

              <!-- Status pill -->
              <template v-else-if="col.key === 'status'">
                <span
                  class="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                  :class="statusColor(item.status)"
                >
                  {{ item.status }}
                </span>
              </template>

              <!-- Priority text -->
              <template v-else-if="col.key === 'priority'">
                <span class="font-semibold uppercase text-[10px] tracking-wide" :class="priorityColor(item.priority)">
                  {{ item.priority }}
                </span>
              </template>

              <!-- Progress bar -->
              <template v-else-if="col.key === 'progress'">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-1.5 bg-on-surface/10 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all"
                      :class="progressColor(item.progress)"
                      :style="{ width: item.progress + '%' }"
                    />
                  </div>
                  <span class="text-on-surface/50 tabular-nums w-7 text-right">{{ item.progress }}%</span>
                </div>
              </template>

              <!-- Budget -->
              <template v-else-if="col.key === 'budget'">
                <span class="text-right block tabular-nums">${{ (item.budget as number).toLocaleString() }}</span>
              </template>

              <!-- Default (assignee, due) -->
              <template v-else>
                {{ item[col.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between text-xs text-on-surface/60">
      <span>{{ grid.total.value }} projects</span>

      <div class="flex items-center gap-1">
        <button
          class="px-2.5 py-1 border border-divider rounded hover:bg-surface-tint disabled:op-30 transition-colors"
          :disabled="grid.pagination.isFirst.value"
          @click="grid.pagination.prev()"
        >
          Prev
        </button>

        <span class="px-2 py-1 tabular-nums">
          {{ grid.pagination.page.value }} / {{ grid.pagination.pages }}
        </span>

        <button
          class="px-2.5 py-1 border border-divider rounded hover:bg-surface-tint disabled:op-30 transition-colors"
          :disabled="grid.pagination.isLast.value"
          @click="grid.pagination.next()"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
