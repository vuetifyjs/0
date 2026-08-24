/**
 * @module BuPaginationItem
 *
 * @remarks
 * Bulma `li > a.pagination-link` — v0 Pagination.Item as an anchor. Current
 * page gets `is-current` from `usePaginationRoot`. Atom owns aria-current /
 * aria-label / role from the Item attrs (no aria-selected on this surface —
 * do not re-spread attrs onto a custom anchor).
 */

<script lang="ts">
  // Framework
  import { Pagination, usePaginationRoot } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BuPaginationItemProps {
    /** Page number this link represents */
    value: number
    /** Namespace of the Pagination.Root context */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuPaginationItem' })

  defineSlots<{
    /** Link content — defaults to the page number */
    default?: (props: { page: number, isSelected: boolean }) => any
  }>()

  const { value, namespace = 'v0:pagination' } = defineProps<BuPaginationItemProps>()

  const pagination = usePaginationRoot(namespace)
  const isSelected = toRef(() => pagination.page.value === value)
</script>

<template>
  <li>
    <Pagination.Item
      v-slot="{ page }"
      as="a"
      class="pagination-link"
      :class="{ 'is-current': isSelected }"
      :namespace
      :value
    >
      <slot :is-selected :page>{{ page }}</slot>
    </Pagination.Item>
  </li>
</template>
