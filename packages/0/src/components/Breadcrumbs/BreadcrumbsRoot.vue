/**
 * @module BreadcrumbsRoot
 *
 * @remarks
 * Root component for responsive breadcrumb navigation using declarative children.
 *
 * Uses createBreadcrumbs composable as its backing model (like TabsRoot uses createStep).
 * Also creates a Group context with enrollment for overflow tracking, and Overflow
 * context to determine which items fit. Visibility is controlled via selection state.
 */

<script lang="ts">
  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Composables
  import { createBreadcrumbs } from '#v0/composables/createBreadcrumbs'
  import { createGroup } from '#v0/composables/createGroup'
  import { createOverflow } from '#v0/composables/createOverflow'
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { BreadcrumbsRootContext, BreadcrumbsTicket } from './types'
  import type { ShallowRef } from 'vue'

  export type { BreadcrumbsRootContext, BreadcrumbsTicket, BreadcrumbsTicketType } from './types'

  export interface BreadcrumbsRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Default divider character/text */
    divider?: string
    /** Default ellipsis character/text */
    ellipsis?: string
    /** Gap between items in pixels. @default 8 */
    gap?: number
    /** Accessible label for the navigation landmark */
    label?: string
  }

  export interface BreadcrumbsRootSlotProps {
    /** Whether items are being truncated */
    isOverflowing: boolean
    /** Number of items that fit in available space */
    capacity: number
    /** Total number of registered items */
    total: number
    /** Current depth of the breadcrumb path */
    depth: number
    /** Whether at root level */
    isRoot: boolean
    /** Navigate to root */
    first: () => void
    /** Navigate up one level */
    prev: () => void
    /** Navigate to a specific item */
    select: (id: ID) => void
    /** Attributes to bind to the root element */
    attrs: {
      'aria-label': string
      'role': 'navigation' | undefined
    }
  }

  export const [useBreadcrumbsRoot, provideBreadcrumbsRoot] = createContext<BreadcrumbsRootContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'BreadcrumbsRoot' })

  defineSlots<{
    default: (props: BreadcrumbsRootSlotProps) => unknown
  }>()

  const {
    namespace = 'v0:breadcrumbs',
    as = 'nav',
    renderless,
    divider = '/',
    ellipsis = '…',
    gap = 8,
    label,
  } = defineProps<BreadcrumbsRootProps>()

  const locale = useLocale()
  const containerRef = useTemplateRef('container')

  const breadcrumbs = createBreadcrumbs({ enroll: true })

  const group = createGroup<BreadcrumbsTicket>({
    enroll: true,
    multiple: true,
  })

  // Reserved widths — first pair + ellipsis are excluded from the overflow
  // measurement pool and tracked separately so capacity is accurate.
  const ellipsisWidth = shallowRef(0)
  const firstItemWidth = shallowRef(0)
  const firstDividerWidth = shallowRef(0)

  const overflow = createOverflow({
    container: () => containerRef.value?.element as Element | undefined,
    gap,
    reserved: () => {
      let r = 0
      if (firstItemWidth.value > 0) r += firstItemWidth.value + gap
      if (firstDividerWidth.value > 0) r += firstDividerWidth.value + gap
      if (ellipsisWidth.value > 0) r += ellipsisWidth.value + gap
      return r
    },
    reverse: true,
  })

  const isOverflowing = overflow.isOverflowing

  // Element measurement routing — first item/divider write to reserved refs,
  // everything else feeds into the overflow pool.
  let _firstItemIndex: number | null = null
  let _firstDividerIndex: number | null = null

  function measureToRef (el: Element | undefined, target: ShallowRef<number>) {
    if (!IN_BROWSER || !el) {
      target.value = 0
      return
    }
    const htmlEl = el as HTMLElement
    const style = getComputedStyle(htmlEl)
    const marginX = Number.parseFloat(style.marginLeft) + Number.parseFloat(style.marginRight)
    target.value = htmlEl.offsetWidth + marginX
  }

  function measureElement (index: number, type: 'item' | 'divider', el: Element | undefined) {
    if (type === 'item' && (_firstItemIndex === null || index <= _firstItemIndex)) {
      _firstItemIndex = el ? index : null
      measureToRef(el, firstItemWidth)
      return
    }
    if (type === 'divider' && (_firstDividerIndex === null || index <= _firstDividerIndex)) {
      _firstDividerIndex = el ? index : null
      measureToRef(el, firstDividerWidth)
      return
    }
    overflow.measure(index, el)
  }

  watch(
    [() => overflow.capacity.value, () => group.size],
    ([capacity]) => {
      const all = group.values()

      // Separate ellipsis tickets from content (items + dividers)
      type Ticket = typeof all[number]
      const contentTickets: Ticket[] = []
      const ellipsisTickets: Ticket[] = []

      for (const ticket of all) {
        if (ticket.type === 'ellipsis') {
          ellipsisTickets.push(ticket)
        } else {
          contentTickets.push(ticket)
        }
      }

      const contentSize = contentTickets.length
      const measuredCount = Math.max(0, contentSize - 2)

      const fI = firstItemWidth.value
      const fD = firstDividerWidth.value
      const eW = ellipsisWidth.value
      const reserved = fI + gap + fD + gap + eW + gap

      if (capacity === Infinity || capacity >= measuredCount) {
        // Everything fits — show all content, hide ellipsis
        for (const t of ellipsisTickets) group.unselect(t.id)
        for (const t of contentTickets) {
          if (!t.isSelected.value) group.select(t.id)
        }
        return
      }

      for (const t of ellipsisTickets) group.select(t.id)

      for (let i = 0; i < 2 && i < contentSize; i++) {
        if (!contentTickets[i]!.isSelected.value) group.select(contentTickets[i]!.id)
      }

      const lastIndex = contentSize - 1
      const poolStart = 2
      const poolSize = Math.max(0, lastIndex - poolStart + 1)
      const toShow = Math.min(poolSize, capacity)
      const showStart = lastIndex - toShow + 1

      for (let i = poolStart; i <= lastIndex; i++) {
        const t = contentTickets[i]!
        if (i >= showStart) {
          if (!t.isSelected.value) group.select(t.id)
        } else {
          group.unselect(t.id)
        }
      }

      if (toShow > 0 && showStart > poolStart && contentTickets[showStart]!.type === 'item') {
        const sep = showStart - 1
        if (sep >= poolStart && contentTickets[sep]!.type === 'divider' && !contentTickets[sep]!.isSelected.value) group.select(contentTickets[sep]!.id)
      }

      if (capacity === 0) {
        if (lastIndex >= poolStart && !contentTickets[lastIndex]!.isSelected.value) group.select(contentTickets[lastIndex]!.id)

        const w = overflow.width.value

        if (w < reserved + fD && contentSize > 1) group.unselect(contentTickets[1]!.id)
        if (w < fI + gap + eW + gap) {
          for (const t of ellipsisTickets) group.unselect(t.id)
        }
        if (w < fI + gap) {
          group.unselect(contentTickets[0]!.id)
        }
      }
    },
    { immediate: true },
  )

  provideBreadcrumbsRoot(namespace, {
    breadcrumbs,
    group,
    overflow,
    divider: toRef(() => divider),
    ellipsis: toRef(() => ellipsis),
    isOverflowing,
    ellipsisWidth,
    measureElement,
  })

  const slotProps = toRef((): BreadcrumbsRootSlotProps => ({
    isOverflowing: overflow.isOverflowing.value,
    capacity: overflow.capacity.value,
    total: group.size,
    depth: breadcrumbs.depth.value,
    isRoot: breadcrumbs.isRoot.value,
    first: breadcrumbs.first,
    prev: breadcrumbs.prev,
    select: breadcrumbs.select,
    attrs: {
      'aria-label': label ?? locale.t('Breadcrumbs.label', undefined, 'Breadcrumb'),
      'role': as === 'nav' ? undefined : 'navigation',
    },
  }))
</script>

<template>
  <Atom
    ref="container"
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
