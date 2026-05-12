<script setup lang="ts">
  import { mdiAccountGroup, mdiCalendarWeek } from '@mdi/js'

  import { createDataGrid } from '@vuetify/v0'

  import { columns } from './columns'
  import { schedule } from './data'

  const grid = createDataGrid({
    items: schedule,
    columns,
    rowSpanning (item, column) {
      if (column !== 'department') return 1

      const index = schedule.findIndex(s => s.id === item.id)
      let count = 1

      while (index + count < schedule.length && schedule[index + count].department === item.department) {
        count++
      }

      return count
    },
  })

  function statusClass (status: string) {
    if (status === 'available') return 'bg-success/15 text-success'
    if (status === 'busy') return 'bg-warning/15 text-warning'
    return 'bg-surface-variant/50 text-on-surface-variant'
  }

  function dotClass (status: string) {
    if (status === 'available') return 'bg-success'
    if (status === 'busy') return 'bg-warning'
    return 'bg-on-surface-variant/40'
  }

  function initials (member: string) {
    return member.split(' ').map(part => part[0]).join('').slice(0, 2)
  }

  function avatarColor (member: string) {
    const colors = ['bg-primary/20 text-primary', 'bg-info/20 text-info', 'bg-success/20 text-success', 'bg-warning/20 text-warning', 'bg-error/20 text-error']
    const sum = [...member].reduce((acc, char) => acc + (char.codePointAt(0) ?? 0), 0)
    return colors[sum % colors.length]
  }

  const summary = ['available', 'busy', 'off'].map(status => ({
    status,
    count: schedule.reduce((total, item) => {
      return total + ['mon', 'tue', 'wed', 'thu', 'fri'].filter(day => item[day as 'mon'] === status).length
    }, 0),
  }))

  const dayColumns = ['mon', 'tue', 'wed', 'thu', 'fri']
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between flex-wrap gap-2">
      <div class="flex items-center gap-2 text-sm">
        <svg class="w-4 h-4 text-on-surface-variant" viewBox="0 0 24 24">
          <path :d="mdiCalendarWeek" fill="currentColor" />
        </svg>

        <span class="font-medium">Team availability — this week</span>
      </div>

      <div class="flex items-center gap-3 text-xs">
        <div
          v-for="entry in summary"
          :key="entry.status"
          class="flex items-center gap-1.5"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="dotClass(entry.status)" />
          <span class="capitalize text-on-surface-variant">{{ entry.status }}</span>
          <span class="tabular-nums font-medium">{{ entry.count }}</span>
        </div>
      </div>
    </div>

    <div class="border border-divider rounded-lg overflow-x-auto">
      <table class="w-full text-sm min-w-[720px] table-fixed">
        <thead>
          <tr class="border-b border-divider bg-surface-tint">
            <th
              v-for="col in grid.layout.columns.value"
              :key="col.key"
              class="px-3 py-2.5 text-left font-medium text-xs uppercase tracking-wide text-on-surface-variant"
              :class="dayColumns.includes(col.key) ? 'text-center' : ''"
              :style="{ width: col.size + '%' }"
            >
              {{ columns.find(c => c.key === col.key)?.title }}
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-divider">
          <tr
            v-for="item in grid.items.value"
            :key="item.id"
            class="hover:bg-surface-tint/40 transition-colors"
          >
            <template v-for="col in grid.layout.columns.value" :key="col.key">
              <td
                v-if="!grid.spans.value.get(item.id as number)?.get(col.key)?.hidden"
                class="px-3 py-2"
                :class="{
                  'bg-surface-tint/60 font-medium align-middle border-r border-divider text-xs uppercase tracking-wide text-on-surface-variant': col.key === 'department' && (grid.spans.value.get(item.id as number)?.get(col.key)?.rowSpan ?? 1) > 1,
                  'text-center': dayColumns.includes(col.key),
                }"
                :rowspan="grid.spans.value.get(item.id as number)?.get(col.key)?.rowSpan"
                :style="{ width: col.size + '%' }"
              >
                <template v-if="col.key === 'department'">
                  {{ item.department }}
                </template>

                <template v-else-if="col.key === 'member'">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
                      :class="avatarColor(item.member)"
                    >
                      {{ initials(item.member) }}
                    </div>

                    <span>{{ item.member }}</span>
                  </div>
                </template>

                <template v-else>
                  <span
                    class="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full"
                    :class="statusClass(item[col.key] as string)"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="dotClass(item[col.key] as string)" />
                    {{ item[col.key] }}
                  </span>
                </template>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center gap-2 text-xs text-on-surface-variant">
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
        <path :d="mdiAccountGroup" fill="currentColor" />
      </svg>

      <span>{{ schedule.length }} members across {{ new Set(schedule.map(s => s.department)).size }} departments — department cells span all members within</span>
    </div>
  </div>
</template>
