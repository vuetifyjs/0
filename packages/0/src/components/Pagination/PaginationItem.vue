<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { usePagination } from '#v0/composables/usePagination'
  import { useContext } from '#v0/composables/createContext'

  // Utilities
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'
  import { genId } from '#v0/utilities'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { RegistryContext } from '#v0/composables/useRegistry'

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
  defineOptions({ name: 'PaginationItem' })

  defineSlots<PaginationItemSlots>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    value,
    disabled,
  } = defineProps<PaginationItemProps>()

  const pagination = usePagination(namespace)
  const itemRegistry = useContext<RegistryContext>(`${namespace}:item`)

  const id = genId()
  const atom = useTemplateRef<AtomExpose>('atom')

  watch(() => atom.value?.element, el => {
    if (el) itemRegistry.register({ id, value: el })
  }, { immediate: true })

  onBeforeUnmount(() => itemRegistry.unregister(id))

  const isSelected = toRef(() => pagination.page.value === value)

  function goto () {
    if (disabled) return

    pagination.goto(value)
  }

  const slotProps = toRef(() => ({
    page: value,
    isSelected: isSelected.value,
    disabled,
    goto,
  }))
</script>

<template>
  <Atom
    ref="atom"
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
