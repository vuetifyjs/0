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
    as="div"
    class="emerald-pagination"
  >
    <PaginationRoot
      v-model="page"
      class="emerald-pagination__nav"
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
  display: inline-flex;
  align-items: center;
  width: fit-content;
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b2-size);
  font-weight: var(--emerald-text-b2-weight);
  line-height: var(--emerald-text-b2-height);
  color: var(--emerald-on-background);
}

.emerald-pagination__nav {
  display: inline-flex;
  align-items: center;
  gap: var(--emerald-spacing-s);
}
</style>
