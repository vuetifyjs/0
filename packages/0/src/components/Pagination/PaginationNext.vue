<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { usePagination } from '#v0/composables/usePagination'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface PaginationNextProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Override disabled state */
    disabled?: boolean
  }

  export interface PaginationNextSlots {
    default: (props: {
      /** Whether already on last page */
      disabled: boolean
      /** Go to next page */
      goto: () => void
    }) => any
  }
</script>

<script setup lang="ts">
  // Utilities
  import { inject, toRef, useTemplateRef } from 'vue'

  // Local
  import { PaginationElementKey } from './PaginationRoot.vue'

  // Types
  import type { AtomExpose } from '#v0/components/Atom'

  defineOptions({ name: 'PaginationNext' })

  defineSlots<PaginationNextSlots>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    disabled = undefined,
  } = defineProps<PaginationNextProps>()

  const context = usePagination(namespace)

  // Register element for responsive measurement
  const atomRef = useTemplateRef<AtomExpose>('atomRef')
  const registerElement = inject(PaginationElementKey, undefined)
  if (registerElement) {
    registerElement(toRef(() => atomRef.value?.element as HTMLElement | undefined))
  }

  const isDisabled = toRef(() => disabled ?? context.isLast.value)

  const slotProps = toRef(() => ({
    disabled: isDisabled.value,
    goto: context.next,
  }))
</script>

<template>
  <Atom
    ref="atomRef"
    :aria-disabled="isDisabled"
    aria-label="Go to next page"
    :as
    :data-disabled="isDisabled || undefined"
    :disabled="isDisabled"
    :renderless
    @click="context.next"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
