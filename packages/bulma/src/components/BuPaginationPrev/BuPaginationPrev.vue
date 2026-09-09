/**
 * @module BuPaginationPrev
 *
 * @remarks
 * Bulma `.pagination-previous` — v0 Pagination.Prev as an anchor. Applies
 * `is-disabled` from `usePaginationRoot` when on the first page; authored
 * attrs such as `title` fall through onto the anchor.
 */

<script lang="ts">
  // Framework
  import { Pagination, usePaginationRoot } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BuPaginationPrevProps {
    /** Namespace of the Pagination.Root context */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuPaginationPrev' })

  defineSlots<{
    /** Anchor label — defaults to `Previous` */
    default?: () => any
  }>()

  const { namespace = 'v0:pagination' } = defineProps<BuPaginationPrevProps>()

  const pagination = usePaginationRoot(namespace)
  const isDisabled = toRef(() => pagination.isFirst.value)
</script>

<template>
  <Pagination.Prev
    as="a"
    class="pagination-previous"
    :class="{ 'is-disabled': isDisabled }"
    :namespace
  >
    <slot>Previous</slot>
  </Pagination.Prev>
</template>
