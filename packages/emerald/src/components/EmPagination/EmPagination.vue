<script lang="ts">
  // Framework
  import { Atom, PaginationRoot } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface EmPaginationProps extends AtomProps {
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
    as = 'nav',
    renderless = false,
  } = defineProps<EmPaginationProps>()

  const page = defineModel<number>({ default: 1 })
</script>

<template>
  <Atom
    :as
    class="emerald-pagination"
    :renderless
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
  </Atom>
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
