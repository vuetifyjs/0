<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { usePagination } from '#v0/composables/usePagination'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { PaginationItem } from '#v0/composables/usePagination'

  export interface PaginationContentProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface PaginationContentSlots {
    default: (props: {
      /** Visible page items for rendering */
      items: PaginationItem[]
    }) => any
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'PaginationContent' })

  defineSlots<PaginationContentSlots>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:pagination',
  } = defineProps<PaginationContentProps>()

  const context = usePagination(namespace)

  const slotProps = toRef(() => ({
    items: context.items.value,
  }))
</script>

<template>
  <Atom :as :renderless>
    <slot v-bind="slotProps" />
  </Atom>
</template>
