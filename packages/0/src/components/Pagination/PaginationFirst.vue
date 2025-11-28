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
  import { onScopeDispose, toRef, useTemplateRef, watch } from 'vue'

  // Local
  import { usePaginationElements } from './PaginationRoot.vue'

  // Types
  import type { AtomExpose } from '#v0/components/Atom'

  defineOptions({ name: 'PaginationFirst' })

  defineSlots<PaginationFirstSlots>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    disabled = undefined,
  } = defineProps<PaginationFirstProps>()

  const context = usePagination(namespace)

  // Register element for responsive measurement
  const atomRef = useTemplateRef<AtomExpose>('atomRef')
  const elements = usePaginationElements()
  const ticket = elements.register()

  watch(() => atomRef.value?.element, el => {
    if (el) elements.upsert(ticket.id, { value: el })
  }, { immediate: true })

  onScopeDispose(() => elements.unregister(ticket.id))

  const isDisabled = toRef(() => disabled ?? context.isFirst.value)

  const slotProps = toRef(() => ({
    disabled: isDisabled.value,
    goto: context.first,
  }))
</script>

<template>
  <Atom
    ref="atomRef"
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
