/**
 * @module PaginationRoot
 *
 * @see https://0.vuetifyjs.com/components/semantic/pagination
 *
 * @remarks
 * Root component for pagination controls that manages page state and provides context
 * to child components. Supports automatic calculation of visible page buttons based on
 * container width, or explicit totalVisible configuration.
 *
 * Built on createPaginationContext from createPagination. Provides navigation
 * methods (first, last, next, prev, select) and computed page ranges via slot props.
 *
 * Provides three contexts via dependency injection:
 * - `usePaginationRoot`: Core pagination state (page, length, navigation methods)
 * - `usePaginationItems`: Registry for page buttons and ellipses (used for width calculation)
 * - `usePaginationControls`: Registry for navigation buttons (first/prev/next/last)
 *
 * The dual registry architecture separates page items from navigation controls because
 * only page items contribute to the responsive visible count calculation. Navigation
 * buttons occupy reserved space that's subtracted from the available width.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createPagination } from '#v0/composables/createPagination'
  import { createRegistry } from '#v0/composables/createRegistry'
  import { useLocale } from '#v0/composables/useLocale'
  import { useResizeObserver } from '#v0/composables/useResizeObserver'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { isElement, isNullOrUndefined, isUndefined } from '#v0/utilities'
  import { computed, nextTick, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { PaginationContext, PaginationTicket } from '#v0/composables/createPagination'
  import type { RegistryContext } from '#v0/composables/createRegistry'

  export const [usePaginationRoot, providePaginationRoot] = createContext<PaginationContext>()
  export const [usePaginationControls, providePaginationControls] = createContext<RegistryContext>({ suffix: 'controls' })
  export const [usePaginationItems, providePaginationItems] = createContext<RegistryContext>({ suffix: 'items' })

  export interface PaginationRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Total number of items */
    size?: number
    /**
     * Number of visible page buttons.
     * If undefined, auto-calculates based on container width.
     */
    totalVisible?: number
    /** Number of items per page */
    itemsPerPage?: number
    /** Ellipsis character */
    ellipsis?: string | false
  }

  export interface PaginationRootSlotProps {
    /** Current page (1-indexed) */
    page: number
    /** Total number of items */
    size: number
    /** Total number of pages */
    pages: number
    /** Items per page */
    itemsPerPage: number
    /** Visible page items for rendering */
    items: PaginationTicket[]
    /** Start index of items on current page (0-indexed) */
    pageStart: number
    /** End index of items on current page (exclusive) */
    pageStop: number
    /** Whether on first page */
    isFirst: boolean
    /** Whether on last page */
    isLast: boolean
    /** Go to first page */
    first: () => void
    /** Go to last page */
    last: () => void
    /** Go to next page */
    next: () => void
    /** Go to previous page */
    prev: () => void
    /** Go to specific page */
    select: (page: number) => void
    /** Attributes to bind to the root element */
    attrs: {
      'aria-label': string
      'role': 'navigation' | undefined
    }
  }
</script>

<script setup lang="ts" generic="T = unknown">
  defineOptions({ name: 'PaginationRoot' })

  defineSlots<{
    default: (props: PaginationRootSlotProps) => any
  }>()

  defineEmits<{
    /** Emitted when the pagination changes */
    'update:model-value': [value: T | T[]]
  }>()

  const {
    as = 'nav',
    renderless,
    namespace = 'v0:pagination',
    size = 1,
    totalVisible,
    itemsPerPage = 10,
    ellipsis = '...',
  } = defineProps<PaginationRootProps>()

  const page = defineModel<number>({ default: 1 })

  const locale = useLocale()
  const controls = createRegistry()
  const items = createRegistry()

  const atom = useTemplateRef<AtomExpose>('atom')
  const root = toRef(() => toElement(atom.value?.element))
  const parentWidth = shallowRef(0)
  const capacity = shallowRef<number>()
  const pitch = shallowRef(0)
  let insets: number | undefined

  useResizeObserver(() => root.value?.parentElement, entries => {
    const next = entries[0]?.contentRect.width ?? 0
    if (parentWidth.value > 0 && next > parentWidth.value) capacity.value = undefined
    parentWidth.value = next
  }, { immediate: true })

  const visible = computed(() => {
    const probe = pitch.value && parentWidth.value ? Math.ceil(parentWidth.value / pitch.value) : Infinity
    const pageCap = capacity.value ?? probe

    // SSR or not measured yet
    if (pageCap === Infinity) return totalVisible ?? 7

    /* v8 ignore start -- branches require browser measurement */
    const noVisible = isNullOrUndefined(totalVisible)

    if (pageCap > 0) return noVisible ? pageCap : Math.min(totalVisible, pageCap)

    return noVisible ? 1 : totalVisible
    /* v8 ignore stop */
  })

  const pagination = createPagination({
    page,
    visible,
    ellipsis,
    size: () => size,
    itemsPerPage: () => itemsPerPage,
  })

  /* v8 ignore start -- browser-only measurement code */
  function elements (registry: RegistryContext) {
    return registry.values().map(ticket => ticket.value).filter(isElement)
  }

  function measure () {
    const pages = elements(items)
    const all = [...elements(controls), ...pages]

    if (!IN_BROWSER || !root.value || isUndefined(insets) || all.length === 0) return

    const width = root.value.getBoundingClientRect().width - insets

    const rects = all.map(el => el.getBoundingClientRect())
    const span = Math.max(...rects.map(rect => rect.right)) - Math.min(...rects.map(rect => rect.left))
    const gap = all.length > 1 ? (span - rects.reduce((sum, rect) => sum + rect.width, 0)) / (all.length - 1) : 0
    const widths = rects.map(rect => rect.width + gap)
    const reserved = widths.slice(0, all.length - pages.length).reduce((sum, value) => sum + value, 0)
    const average = pages.length > 0
      ? widths.slice(-pages.length).reduce((sum, value) => sum + value, 0) / pages.length
      : widths[0]

    return {
      pitch: average,
      rendered: pages.length,
      slots: Math.max(0, Math.floor(Number(((width + gap - reserved) / average).toFixed(2)))),
    }
  }

  function fit (shrink = false) {
    const result = measure()
    if (!result) return

    if (isUndefined(capacity.value)) {
      pitch.value = result.pitch
      if (pagination.items.value.length > result.rendered) return
      capacity.value = result.slots
    } else {
      capacity.value = shrink ? Math.min(capacity.value, result.slots) : result.slots
    }
  }

  useResizeObserver(root, entries => {
    const entry = entries[0]
    if (!entry) return

    insets = (entry.borderBoxSize[0]?.inlineSize ?? entry.contentRect.width) - entry.contentRect.width
    fit()
  })

  watch(pagination.items, () => nextTick(() => fit(true)), { flush: 'post' })
  /* v8 ignore stop */

  const slotProps = toRef((): PaginationRootSlotProps => ({
    page: pagination.page.value,
    size: pagination.size,
    pages: pagination.pages,
    itemsPerPage: pagination.itemsPerPage,
    items: pagination.items.value,
    pageStart: pagination.pageStart.value,
    pageStop: pagination.pageStop.value,
    isFirst: pagination.isFirst.value,
    isLast: pagination.isLast.value,
    first: pagination.first,
    last: pagination.last,
    next: pagination.next,
    prev: pagination.prev,
    select: pagination.select,
    attrs: {
      'aria-label': locale.ti('Pagination.label') ?? 'Pagination',
      'role': as === 'nav' ? undefined : 'navigation',
    },
  }))

  providePaginationRoot(namespace, pagination)
  providePaginationControls(namespace, controls)
  providePaginationItems(namespace, items)
</script>

<template>
  <Atom
    ref="atom"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
