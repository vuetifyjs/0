/**
 * @module BuPaginationEllipsis
 *
 * @remarks
 * Bulma `li > span.pagination-ellipsis` — v0 Pagination.Ellipsis. Character
 * comes from the Root `ellipsis` prop (default `…`).
 */

<script lang="ts">
  // Framework
  import { Pagination } from '@vuetify/v0'

  export interface BuPaginationEllipsisProps {
    /** Namespace of the Pagination.Root context */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuPaginationEllipsis' })

  defineSlots<{
    /** Override the ellipsis glyph */
    default?: () => any
  }>()

  const { namespace } = defineProps<BuPaginationEllipsisProps>()
</script>

<template>
  <li>
    <Pagination.Ellipsis
      v-slot="{ ellipsis }"
      as="span"
      class="pagination-ellipsis"
      :namespace
    >
      <slot>{{ ellipsis }}</slot>
    </Pagination.Ellipsis>
  </li>
</template>
