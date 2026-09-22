<script lang="ts">
  // Framework
  import { Pagination } from '@vuetify/v0'

  // Types
  import type { PaginationRootProps } from '@vuetify/v0'

  export interface EmPaginationProps extends Omit<PaginationRootProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPagination' })

  const {
    size = 1,
    totalVisible,
    itemsPerPage = 10,
    ellipsis = '…',
    namespace,
  } = defineProps<EmPaginationProps>()

  const page = defineModel<number>({ default: 1 })
</script>

<template>
  <div class="emerald-pagination">
    <Pagination.Root
      v-slot="slotProps"
      v-model="page"
      class="emerald-pagination__nav"
      :ellipsis
      :items-per-page
      :namespace
      :size
      :total-visible
    >
      <slot v-bind="slotProps" />
    </Pagination.Root>
  </div>
</template>

<style>
  .emerald-pagination {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: var(--emerald-text-b2-weight, 400);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-pagination__nav {
    display: inline-flex;
    align-items: center;
    gap: var(--emerald-spacing-2xs, 4px);
  }
</style>
