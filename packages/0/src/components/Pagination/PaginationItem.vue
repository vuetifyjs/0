<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { usePagination } from '#v0/composables/usePagination'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface PaginationItemProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Page number this item represents */
    value: number
    /** Override disabled state */
    disabled?: boolean
  }

  export interface PaginationItemSlots {
    default: (props: {
      /** Page number */
      page: number
      /** Whether this page is currently selected */
      isSelected: boolean
      /** Whether this item is disabled */
      disabled: boolean
      /** Go to this page */
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

  defineOptions({ name: 'PaginationItem' })

  defineSlots<PaginationItemSlots>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    value,
    disabled,
  } = defineProps<PaginationItemProps>()

  const context = usePagination(namespace)

  // Register element for responsive measurement
  const atomRef = useTemplateRef<AtomExpose>('atomRef')
  const elements = usePaginationElements(namespace)
  const ticket = elements.register()

  watch(() => atomRef.value?.element, el => {
    if (el) elements.upsert(ticket.id, { value: el })
  }, { immediate: true })

  onScopeDispose(() => elements.unregister(ticket.id))

  const isSelected = toRef(() => context.page.value === value)

  function goto () {
    if (disabled) return

    context.goto(value)
  }

  const slotProps = toRef(() => ({
    page: value,
    isSelected: isSelected.value,
    disabled: disabled ?? false,
    goto,
  }))
</script>

<template>
  <Atom
    ref="atomRef"
    :aria-current="isSelected ? 'page' : undefined"
    :aria-disabled="disabled"
    :as
    :data-selected="isSelected ? '' : undefined"
    :disabled
    :renderless
    @click="goto"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
