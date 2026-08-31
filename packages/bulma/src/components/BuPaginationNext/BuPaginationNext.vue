/**
 * @module BuPaginationNext
 *
 * @remarks
 * Bulma `.pagination-next` — v0 Pagination.Next as an anchor. Applies
 * `is-disabled` from `usePaginationRoot` when on the last page.
 */

<script lang="ts">
  // Framework
  import { Pagination, usePaginationRoot } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BuPaginationNextProps {
    /** Namespace of the Pagination.Root context */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuPaginationNext' })

  defineSlots<{
    /** Anchor label — defaults to `Next page` */
    default?: () => any
  }>()

  const { namespace = 'v0:pagination' } = defineProps<BuPaginationNextProps>()

  const pagination = usePaginationRoot(namespace)
  const isDisabled = toRef(() => pagination.isLast.value)
</script>

<template>
  <Pagination.Next
    as="a"
    class="pagination-next"
    :class="{ 'is-disabled': isDisabled }"
    :namespace
  >
    <slot>Next page</slot>
  </Pagination.Next>
</template>
