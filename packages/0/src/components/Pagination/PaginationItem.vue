/**
 * @module PaginationItem
 *
 * @remarks
 * Individual page button that navigates to a specific page number when clicked.
 * Registers with the parent PaginationRoot for width calculations and provides
 * ARIA attributes for accessibility including aria-current for the selected page.
 */

<script lang="ts">
  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  // Components
  import { Atom } from '#v0/components/Atom'
  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  import { genId } from '#v0/utilities'
  // Utilities
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'

  import { usePaginationItems, usePaginationRoot } from './PaginationRoot.vue'

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

  export interface PaginationItemSlotProps {
    /** Page number */
    page: number
    /** Whether this page is currently selected */
    isSelected: boolean
    /** Whether this item is disabled */
    isDisabled: boolean
    /** Go to this page */
    select: () => void
    /** Attributes to bind to the item element */
    attrs: {
      'aria-label': string
      'aria-current': 'page' | undefined
      'aria-disabled': boolean
      'data-selected': true | undefined
      'data-disabled': true | undefined
      'disabled': boolean | undefined
      'tabindex': number
      'type': 'button' | undefined
      'onClick': () => void
    }
  }

</script>

<script setup lang="ts">
  defineOptions({ name: 'PaginationItem' })

  defineSlots<{
    default: (props: PaginationItemSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:pagination',
    value,
    disabled = false,
    id = genId(),
  } = defineProps<PaginationItemProps>()

  const locale = useLocale()
  const pagination = usePaginationRoot(namespace)
  const items = usePaginationItems(namespace)

  const atom = useTemplateRef<AtomExpose>('atom')

  watch(() => atom.value?.element, el => {
    if (!el) return

    items.register({ id, value: el })
  }, { immediate: true })

  const isSelected = toRef(() => pagination.page.value === value)

  const ariaLabel = toRef(() => {
    return isSelected.value
      ? locale.t('Pagination.currentPage', { page: value }, `Page ${value}, current page`)
      : locale.t('Pagination.goToPage', { page: value }, `Go to page ${value}`)
  })

  function select () {
    if (disabled) return

    pagination.select(value)
  }

  const slotProps = toRef((): PaginationItemSlotProps => ({
    page: value,
    isSelected: isSelected.value,
    isDisabled: disabled,
    select,
    attrs: {
      'aria-label': ariaLabel.value,
      'aria-current': isSelected.value ? 'page' : undefined,
      'aria-disabled': disabled,
      'data-selected': isSelected.value || undefined,
      'data-disabled': disabled || undefined,
      'disabled': as === 'button' ? disabled : undefined,
      'tabindex': disabled ? -1 : 0,
      'type': as === 'button' ? 'button' : undefined,
      'onClick': select,
    },
  }))

  onBeforeUnmount(() => items.unregister(id))
</script>

<template>
  <Atom
    ref="atom"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps">
      {{ value }}
    </slot>
  </Atom>
</template>
