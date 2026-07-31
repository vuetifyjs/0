<script setup lang="ts">
  import PaginatedTable from './PaginatedTable.vue'
  import { PAGE_SIZES, usePaginatedList } from './usePaginatedList'

  const { items, perPage, pagination, visible, resize } = usePaginatedList()
</script>

<template>
  <div class="space-y-4">
    <PaginatedTable
      :pagination
      :per-page
      :resize
      :rows="visible"
      :sizes="PAGE_SIZES"
    />

    <p class="text-xs text-on-surface-variant text-center">
      Showing {{ pagination.pageStart.value + 1 }}–{{ pagination.pageStop.value }}
      of {{ items.length }}
      &middot; Page {{ pagination.page.value }} of {{ pagination.pages }}
    </p>
  </div>
</template>
