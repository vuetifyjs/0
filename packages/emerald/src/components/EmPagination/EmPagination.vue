<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { PaginationRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmPaginationProps extends V0PaperProps {
    size?: number
    totalVisible?: number
    itemsPerPage?: number
    ellipsis?: string | false
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPagination' })

  const {
    size = 1,
    totalVisible,
    itemsPerPage = 10,
    ellipsis = '…',
    ...paperProps
  } = defineProps<EmPaginationProps>()

  const page = defineModel<number>({ default: 1 })
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="nav"
    class="emerald-pagination"
  >
    <PaginationRoot
      v-model="page"
      :ellipsis
      :items-per-page
      :size
      :total-visible
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </PaginationRoot>
  </V0Paper>
</template>

<style>
.emerald-pagination {
  width: fit-content;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: 20px;
  color: var(--emerald-on-background, #1a1230);
}

.emerald-pagination > nav,
.emerald-pagination {
  display: inline-flex;
  align-items: center;
  gap: 0;
}

.emerald-pagination__prev,
.emerald-pagination__next {
  margin: 0 8px;
}
</style>
