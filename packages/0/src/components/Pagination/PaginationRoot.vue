<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createPaginationContext } from '#v0/composables/usePagination'
  import { useElementSize } from '#v0/composables/useResizeObserver'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { PaginationItem } from '#v0/composables/usePagination'
  import type { InjectionKey, MaybeRefOrGetter, Ref } from 'vue'

  export interface PaginationRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Total number of items to paginate */
    size?: MaybeRefOrGetter<number>
    /** Number of items per page */
    itemsPerPage?: MaybeRefOrGetter<number>
    /** Ellipsis character */
    ellipsis?: string
    /**
     * Maximum number of visible page buttons.
     * Enables responsive auto-calculation based on container width.
     */
    maxVisible?: MaybeRefOrGetter<number>
    /** Minimum number of visible page buttons. @default 1 */
    minVisible?: MaybeRefOrGetter<number>
  }

  export interface PaginationRootSlots {
    default: (props: {
      /** Current page (1-indexed) */
      page: number
      /** Total number of items */
      size: number
      /** Total number of pages */
      pages: number
      /** Items per page */
      itemsPerPage: number
      /** Number of visible page buttons */
      visible: number
      /** Visible page items for rendering */
      items: PaginationItem[]
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
      goto: (page: number) => void
    }) => any
  }

  /** Injection key for pagination element registration */
  export const PaginationElementKey: InjectionKey<(el: Ref<HTMLElement | undefined>) => void> = Symbol('PaginationElement')
</script>

<script setup lang="ts">
  // Utilities
  import { computed, provide, shallowRef, toRef, toValue, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose } from '#v0/components/Atom'

  defineOptions({ name: 'PaginationRoot' })

  defineSlots<PaginationRootSlots>()

  const page = defineModel<number>({ default: 1 })

  const {
    as = 'nav',
    renderless,
    namespace = 'v0:pagination',
    size,
    itemsPerPage,
    ellipsis,
    maxVisible,
    minVisible,
  } = defineProps<PaginationRootProps>()

  // Template ref for responsive sizing - Atom exposes element via defineExpose
  const atomRef = useTemplateRef<AtomExpose>('atomRef')
  const rootEl = toRef(() => atomRef.value?.element as Element | undefined)

  // Track container width for responsive calculation
  const { width: containerWidth } = useElementSize(rootEl)

  // Element registration - first child to register provides measurement reference
  const registeredElement = shallowRef<HTMLElement>()

  provide(PaginationElementKey, (el: Ref<HTMLElement | undefined>) => {
    // Only register if we don't have one yet
    if (registeredElement.value) return

    watch(el, newEl => {
      if (newEl && !registeredElement.value) {
        registeredElement.value = newEl
      }
    }, { immediate: true })
  })

  // Measure item width from registered element
  const itemWidth = computed(() => {
    const el = registeredElement.value
    const root = rootEl.value
    if (!el || !root) return 0

    const style = getComputedStyle(el)
    const marginX = parseFloat(style.marginLeft) + parseFloat(style.marginRight)
    const gapX = parseFloat(getComputedStyle(root).gap) || 0

    return el.offsetWidth + Math.max(marginX, gapX)
  })

  // Calculate responsive visible count based on container width
  const responsiveVisible = computed(() => {
    const max = toValue(maxVisible)
    if (max === undefined) return max

    const width = containerWidth.value
    const min = toValue(minVisible) ?? 1
    const btnWidth = itemWidth.value

    if (width <= 0 || btnWidth <= 0) return min

    // Reserve space for nav buttons (first, prev, next, last)
    const navButtonsSpace = btnWidth * 4
    const availableSpace = width - navButtonsSpace

    if (availableSpace <= 0) return min

    const maxButtons = Math.floor(availableSpace / btnWidth)

    return Math.min(max, Math.max(min, maxButtons))
  })

  // Use responsive value, or maxVisible as static fallback, or default 5
  const effectiveVisible = computed(() => {
    return responsiveVisible.value ?? toValue(maxVisible) ?? 5
  })

  const [, providePaginationContext] = createPaginationContext({
    namespace,
    page: page.value,
    size: () => toValue(size) ?? 1,
    visible: effectiveVisible,
    itemsPerPage: toRef(() => toValue(itemsPerPage) ?? 10),
    ellipsis,
  })

  const context = providePaginationContext()

  // Sync model with context
  watch(page, v => context.page.value = v)
  watch(() => context.page.value, v => page.value = v)

  const slotProps = toRef(() => ({
    page: context.page.value,
    size: context.size,
    pages: context.pages,
    itemsPerPage: context.itemsPerPage.value,
    visible: effectiveVisible.value,
    items: context.items.value,
    pageStart: context.pageStart.value,
    pageStop: context.pageStop.value,
    isFirst: context.isFirst.value,
    isLast: context.isLast.value,
    first: context.first,
    last: context.last,
    next: context.next,
    prev: context.prev,
    goto: context.goto,
  }))
</script>

<template>
  <Atom
    ref="atomRef"
    aria-label="pagination"
    :as
    :renderless
    role="navigation"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
