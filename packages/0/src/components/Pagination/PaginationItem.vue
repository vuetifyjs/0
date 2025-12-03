/**
 * @module PaginationItem
 *
 * @remarks
 * Individual page button that navigates to a specific page number when clicked.
 * Registers with the parent PaginationRoot for width calculations and provides
 * ARIA attributes for accessibility including aria-current for the selected page.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'
  import { usePagination } from '#v0/composables/usePagination'
  import { usePaginationItems } from './PaginationRoot.vue'

  // Utilities
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'
  import { genId } from '#v0/utilities'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface PaginationItemProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Page number this item represents */
    value: number
    /** Override disabled state */
    disabled?: boolean
    /** Unique identifier for registration */
    id?: string
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
      select: () => void
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
    disabled = false,
    id = genId(),
  } = defineProps<PaginationItemProps>()

  const locale = useLocale()
  const pagination = usePagination(namespace)
  const items = usePaginationItems(namespace)

  const atom = useTemplateRef<AtomExpose>('atom')

  watch(() => atom.value?.element, el => {
    if (!el) return

    items.register({ id, value: el })
  }, { immediate: true })

  onBeforeUnmount(() => items.unregister(id))

  const isSelected = toRef(() => pagination.page.value === value)

  const ariaLabel = toRef(() => {
    return isSelected.value
      ? locale.t('Pagination.currentPage', { page: value }, `Page ${value}, current page`)
      : locale.t('Pagination.goToPage', { page: value }, `Go to page ${value}`)
  })

  const slotProps = toRef(() => ({
    ariaLabel: ariaLabel.value,
    ariaCurrent: isSelected.value ? 'page' : undefined,
    page: value,
    isSelected: isSelected.value,
    dataSelected: isSelected.value,
    disabled,
    select,
  }))

  function select () {
    if (disabled) return

    pagination.select(value)
  }
</script>

<template>
  <Atom
    ref="atom"
    :aria-current="slotProps.ariaCurrent"
    :aria-label="slotProps.ariaLabel"
    :as
    :data-disabled="slotProps.disabled || undefined"
    :data-selected="slotProps.dataSelected || undefined"
    :disabled="as === 'button' ? slotProps.disabled : undefined"
    :renderless
    :type="as === 'button' ? 'button' : undefined"
    @click="slotProps.select"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
