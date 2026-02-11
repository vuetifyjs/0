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
  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Composables
  import { createBreadcrumbs } from '#v0/composables/createBreadcrumbs'
  import { createGroup } from '#v0/composables/createGroup'
  import { createOverflow } from '#v0/composables/createOverflow'

  // Utilities
  import { toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { BreadcrumbsRootContext, BreadcrumbsTicket } from './types'

  export type { BreadcrumbsRootContext, BreadcrumbsTicket, BreadcrumbsTicketType } from './types'

  export interface BreadcrumbsRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Default divider character/text */
    divider?: string
    /** Default ellipsis character/text */
    ellipsis?: string
    /** Maximum visible breadcrumb items before collapsing. @default Infinity */
    visible?: number
    /** Gap between items in pixels. @default 8 */
    gap?: number
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
      'aria-label': 'Breadcrumb'
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
    visible = Infinity,
    gap = 8,
  } = defineProps<BreadcrumbsRootProps>()

  const containerRef = useTemplateRef('container')

  const breadcrumbs = createBreadcrumbs({
    visible,
    ellipsis,
    enroll: true,
  })

  const group = createGroup<BreadcrumbsTicket>({
    enroll: true,
    multiple: true,
  })

  const overflow = createOverflow({
    container: () => containerRef.value?.element as Element | undefined,
    gap,
    reverse: true,
  })

  const isOverflowing = overflow.isOverflowing

  watch(
    [() => overflow.capacity.value, () => group.size],
    ([capacity, size]) => {
      if (capacity === Infinity || capacity >= size) {
        // Everything fits - select all items, hide ellipsis
        for (const ticket of group.values()) {
          if (ticket.type === 'ellipsis') {
            group.unselect(ticket.id)
          } else if (!ticket.isSelected.value) {
            group.select(ticket.id)
          }
        }
        return
      }

      const items = group.values()
      const hiddenCount = size - capacity

      let hidden = 0
      for (const ticket of items) {
        if (ticket.type === 'ellipsis') {
          group.select(ticket.id)
        } else if (hidden < hiddenCount) {
          group.unselect(ticket.id)
          hidden++
        } else {
          if (!ticket.isSelected.value) {
            group.select(ticket.id)
          }
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
      'aria-label': 'Breadcrumb',
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
