<script setup lang="ts">
  import { createPagination } from '@vuetify/v0'
  import { computed } from 'vue'

  const items = Array.from({ length: 47 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    category: ['Design', 'Engineering', 'Marketing', 'Sales'][i % 4]!,
  }))

  const pagination = createPagination({
    size: items.length,
    itemsPerPage: 6,
  })

  const visible = computed(() =>
    items.slice(pagination.pageStart.value, pagination.pageStop.value),
  )
</script>

<template>
  <div class="space-y-4">
    <!-- Item list -->
    <div class="border border-divider rounded-lg overflow-hidden divide-y divide-divider">
      <div
        v-for="item in visible"
        :key="item.id"
        class="flex items-center justify-between px-3 py-2"
      >
        <div class="flex items-center gap-3">
          <span class="text-xs text-on-surface-variant font-mono w-6 text-right">
            {{ item.id }}
          </span>

          <span class="text-sm text-on-surface">{{ item.name }}</span>
        </div>

        <span class="text-xs px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant">
          {{ item.category }}
        </span>
      </div>
    </div>

    <!-- Pagination controls -->
    <div class="flex items-center justify-center gap-1">
      <!-- First -->
      <button
        class="px-2 py-1 text-xs rounded border border-divider hover:bg-surface-tint disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="pagination.isFirst.value"
        @click="pagination.first()"
      >
        First
      </button>

      <!-- Prev -->
      <button
        class="px-2 py-1 text-xs rounded border border-divider hover:bg-surface-tint disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="pagination.isFirst.value"
        @click="pagination.prev()"
      >
        Prev
      </button>

      <!-- Page items -->
      <template v-for="item in pagination.items.value" :key="item.value">
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

      <!-- Next -->
      <button
        class="px-2 py-1 text-xs rounded border border-divider hover:bg-surface-tint disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="pagination.isLast.value"
        @click="pagination.next()"
      >
        Next
      </button>

      <!-- Last -->
      <button
        class="px-2 py-1 text-xs rounded border border-divider hover:bg-surface-tint disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="pagination.isLast.value"
        @click="pagination.last()"
      >
        Last
      </button>
    </div>

    <!-- Status -->
    <p class="text-xs text-on-surface-variant text-center">
      Showing {{ pagination.pageStart.value + 1 }}–{{ pagination.pageStop.value }}
      of {{ items.length }}
      &middot; Page {{ pagination.page.value }} of {{ pagination.pages }}
    </p>
  </div>
</template>
