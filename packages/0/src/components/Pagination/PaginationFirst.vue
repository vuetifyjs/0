<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { usePagination } from '#v0/composables/usePagination'
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { toRef } from 'vue'

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
      onClick: () => void
    }) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'PaginationFirst' })

  defineSlots<PaginationFirstSlots>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    disabled,
  } = defineProps<PaginationFirstProps>()

  const locale = useLocale()
  const pagination = usePagination(namespace)

  const isDisabled = toRef(() => disabled || pagination.isFirst.value)

  function onClick () {
    if (isDisabled.value) return

    pagination.first()
  }

  const slotProps = toRef(() => ({
    disabled: isDisabled.value,
    onClick,
  }))
</script>

<template>
  <Atom
    :aria-disabled="isDisabled"
    :aria-label="locale.t('Go to first page')"
    :as
    :data-disabled="isDisabled || undefined"
    :disabled="isDisabled"
    :renderless
    @click="onClick"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
