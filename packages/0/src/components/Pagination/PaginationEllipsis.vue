/**
 * @module PaginationEllipsis
 *
 * @remarks
 * Visual indicator for omitted page numbers in pagination. Renders the ellipsis
 * character (default "...") and is hidden from screen readers via aria-hidden.
 * Can override the ellipsis character via prop or inherits from PaginationRoot context.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { usePagination } from '#v0/composables/usePagination'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface PaginationEllipsisProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Ellipsis character to display (overrides context) */
    ellipsis?: string
  }

  export interface PaginationEllipsisSlots {
    default: (props: {
      /** Ellipsis character */
      ellipsis: string | false
    }) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'PaginationEllipsis' })

  defineSlots<PaginationEllipsisSlots>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:pagination',
    ellipsis,
  } = defineProps<PaginationEllipsisProps>()

  const pagination = usePagination(namespace)

  const resolvedEllipsis = toRef(() => ellipsis ?? pagination.ellipsis)

  const slotProps = toRef(() => ({
    ellipsis: resolvedEllipsis.value,
  }))
</script>

<template>
  <Atom
    aria-hidden="true"
    :as
    :renderless
  >
    <slot v-bind="slotProps">
      {{ resolvedEllipsis }}
    </slot>
  </Atom>
</template>
