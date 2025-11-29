<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { usePagination } from '#v0/composables/usePagination'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface PaginationPrevProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Override disabled state */
    disabled?: boolean
  }

  export interface PaginationPrevSlots {
    default: (props: {
      /** Whether already on first page */
      disabled: boolean
      /** Go to previous page */
      onClick: () => void
    }) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'PaginationPrev' })

  defineSlots<PaginationPrevSlots>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    disabled,
  } = defineProps<PaginationPrevProps>()

  const pagination = usePagination(namespace)

  const isDisabled = toRef(() => disabled || pagination.isFirst.value)

  function onClick () {
    if (isDisabled.value) return

    pagination.prev()
  }

  const slotProps = toRef(() => ({
    disabled: isDisabled.value,
    onClick,
  }))
</script>

<template>
  <Atom
    :aria-disabled="isDisabled"
    aria-label="Go to previous page"
    :as
    :data-disabled="isDisabled || undefined"
    :disabled="isDisabled"
    :renderless
    @click="onClick"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
