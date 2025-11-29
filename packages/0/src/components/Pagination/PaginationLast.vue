<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { usePagination } from '#v0/composables/usePagination'

  // Utilities
  import { toRef } from 'vue'

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
      onClick: () => void
    }) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'PaginationLast' })

  defineSlots<PaginationLastSlots>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    disabled,
  } = defineProps<PaginationLastProps>()

  const pagination = usePagination(namespace)

  const isDisabled = toRef(() => disabled || pagination.isLast.value)

  function onClick () {
    if (isDisabled.value) return

    pagination.last()
  }

  const slotProps = toRef(() => ({
    disabled: isDisabled.value,
    onClick,
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
    @click="onClick"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
