/**
 * @module BuPagination
 *
 * @remarks
 * Bulma `nav.pagination` slot host. Maps `pages` onto v0 Pagination.Root as
 * `:size="pages" :items-per-page="1"` (v0 size is total items). Compose
 * BuPaginationPrev, BuPaginationNext, then BuPaginationList — that DOM order
 * is load-bearing; Bulma CSS flex-orders the list between the anchors.
 */

<script lang="ts">
  // Framework
  import { Pagination } from '@vuetify/v0'

  // Utilities
  import { toRef, watch } from 'vue'

  // Types
  import type { PaginationRootSlotProps } from '@vuetify/v0'

  export interface BuPaginationProps {
    /** Total page count (maps to v0 size with one item per page) */
    pages?: number
    /** Number of visible page buttons; omit for v0's responsive auto-measure */
    visible?: number
    /** Ellipsis character rendered between page ranges */
    ellipsis?: string
    /** Bulma size modifier */
    size?: 'small' | 'normal' | 'medium' | 'large'
    /** Rounded page buttons */
    rounded?: boolean
    /** Center the page list */
    centered?: boolean
    /** Right-align the page list */
    right?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuPagination' })

  defineEmits<{
    /** Emitted when the current page changes */
    'update:model-value': [value: number]
  }>()

  defineSlots<{
    /** Prev, Next, then List — fixture DOM order */
    default?: (props: PaginationRootSlotProps) => any
  }>()

  const {
    pages = 1,
    visible,
    ellipsis = '…',
    size,
    rounded,
    centered,
    right,
  } = defineProps<BuPaginationProps>()

  const page = defineModel<number>({ default: 1 })

  // v0's createPagination clamps only in its computed getter and writes raw
  // values through, so an out-of-range v-model (page > pages, or pages
  // shrinking below the current page) silently desyncs from the rendered
  // state. Write the clamp back so the parent's model matches what renders.
  watch([() => pages, page], () => {
    const max = Math.max(1, pages)
    if (page.value > max) page.value = max
    else if (page.value < 1) page.value = 1
  }, { immediate: true })

  const classes = toRef(() => [
    size && `is-${size}`,
    rounded && 'is-rounded',
    centered && 'is-centered',
    right && 'is-right',
  ])
</script>

<template>
  <Pagination.Root
    v-slot="slotProps"
    v-model="page"
    class="pagination"
    :class="classes"
    :ellipsis
    :items-per-page="1"
    role="navigation"
    :size="pages"
    :total-visible="visible"
  >
    <slot v-bind="slotProps" />
  </Pagination.Root>
</template>
