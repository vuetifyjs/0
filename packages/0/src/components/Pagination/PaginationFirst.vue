<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { usePagination } from '#v0/composables/usePagination'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface PaginationFirstProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Override disabled state */
    disabled?: boolean
  }

  export interface PaginationFirstSlots {
    default: (props: {
      /** Whether button is disabled */
      disabled: boolean
      /** Go to first page */
      goto: () => void
    }) => any
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'PaginationFirst' })

  defineSlots<PaginationFirstSlots>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    disabled = undefined,
  } = defineProps<PaginationFirstProps>()

  const context = usePagination(namespace)

  const isDisabled = toRef(() => disabled ?? context.isFirst.value)

  const slotProps = toRef(() => ({
    disabled: isDisabled.value,
    goto: context.first,
  }))
</script>

<template>
  <Atom
    :aria-disabled="isDisabled"
    aria-label="Go to first page"
    :as
    :data-disabled="isDisabled || undefined"
    :disabled="isDisabled"
    :renderless
    @click="context.first"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
