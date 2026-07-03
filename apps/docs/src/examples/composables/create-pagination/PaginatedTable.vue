<script setup lang="ts">
  import type { PaginationContext } from '@vuetify/v0'
  import type { Employee } from './usePaginatedList'

  const { pagination, perPage, resize, rows, sizes } = defineProps<{
    pagination: PaginationContext
    perPage: number
    resize: (value: number) => void
    rows: Employee[]
    sizes: number[]
  }>()

  const control = 'px-2 py-1 text-xs rounded border border-divider hover:bg-surface-tint disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
</script>

<template>
  <div class="space-y-4">
    <!-- Page-size selector -->
    <div class="flex items-center justify-between">
      <span class="text-xs text-on-surface-variant">Rows per page</span>

      <div class="flex gap-1">
        <button
          v-for="size in sizes"
          :key="size"
          class="size-7 text-xs rounded transition-colors"
          :class="size === perPage
            ? 'bg-primary text-on-primary'
            : 'border border-divider hover:bg-surface-tint text-on-surface'"
          @click="resize(size)"
        >
          {{ size }}
        </button>
      </div>
    </div>

    <!-- Row table -->
    <div class="border border-divider rounded-lg overflow-hidden divide-y divide-divider">
      <div
        v-for="row in rows"
        :key="row.id"
        class="flex items-center justify-between px-3 py-2"
      >
        <div class="flex items-center gap-3">
          <span class="text-xs text-on-surface-variant font-mono w-6 text-right">
            {{ row.id }}
          </span>

          <span class="text-sm text-on-surface">{{ row.name }}</span>
        </div>

        <span class="text-xs px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant">
          {{ row.department }}
        </span>
      </div>
    </div>

    <!-- Navigation controls -->
    <div class="flex items-center justify-center gap-1">
      <button
        :class="control"
        :disabled="pagination.isFirst.value"
        @click="pagination.first()"
      >
        First
      </button>

      <button
        :class="control"
        :disabled="pagination.isFirst.value"
        @click="pagination.prev()"
      >
        Prev
      </button>

      <template v-for="(item, index) in pagination.items.value" :key="index">
        <button
          v-if="item.type === 'page'"
          class="size-8 text-xs rounded transition-colors"
          :class="item.value === pagination.page.value
            ? 'bg-primary text-on-primary'
            : 'hover:bg-surface-tint text-on-surface'"
          @click="pagination.select(item.value)"
        >
          {{ item.value }}
        </button>

        <span
          v-else
          class="size-8 flex items-center justify-center text-xs text-on-surface-variant"
        >
          {{ item.value }}
        </span>
      </template>

      <button
        :class="control"
        :disabled="pagination.isLast.value"
        @click="pagination.next()"
      >
        Next
      </button>

      <button
        :class="control"
        :disabled="pagination.isLast.value"
        @click="pagination.last()"
      >
        Last
      </button>
    </div>
  </div>
</template>
