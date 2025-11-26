<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { usePagination } from '#v0/composables/usePagination'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface PaginationLastProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Override disabled state */
    disabled?: boolean
  }

  export interface PaginationLastSlots {
    default: (props: {
      /** Whether already on last page */
      disabled: boolean
      /** Go to last page */
      goto: () => void
    }) => any
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'PaginationLast' })

  defineSlots<PaginationLastSlots>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    disabled = undefined,
  } = defineProps<PaginationLastProps>()

  const context = usePagination(namespace)

  const isDisabled = toRef(() => disabled ?? context.isLast.value)

  const slotProps = toRef(() => ({
    disabled: isDisabled.value,
    goto: context.last,
  }))
</script>

<template>
  <Atom
    :aria-disabled="isDisabled"
    aria-label="Go to last page"
    :as
    :data-disabled="isDisabled || undefined"
    :disabled="isDisabled"
    :renderless
    @click="context.last"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
