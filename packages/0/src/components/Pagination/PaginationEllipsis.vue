<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { usePagination } from '#v0/composables/usePagination'

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
      ellipsis: string
    }) => any
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'PaginationEllipsis' })

  defineSlots<PaginationEllipsisSlots>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:pagination',
    ellipsis,
  } = defineProps<PaginationEllipsisProps>()

  const context = usePagination(namespace)

  const resolvedEllipsis = toRef(() => ellipsis ?? context.ellipsis)

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
