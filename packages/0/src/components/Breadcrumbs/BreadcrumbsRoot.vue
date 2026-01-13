/**
 * @module BreadcrumbsRoot
 *
 * @remarks
 * Root component for responsive breadcrumb navigation using declarative children.
 *
 * Uses a Group context with enrollment to track items, and Overflow context
 * to determine which items fit. Visibility is controlled via selection state:
 * - Items start selected (visible) via enroll option
 * - Overflow calculation determines capacity
 * - Items beyond capacity are unselected (hidden)
 * - Ellipsis becomes selected (visible) when truncating
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { BreadcrumbsContext, BreadcrumbsTicket } from './types'

  export type { BreadcrumbsContext, BreadcrumbsTicket, BreadcrumbsTicketType } from './types'

  export interface BreadcrumbsRootProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Polymorphic element type */
    as?: string
    /** Default divider character/text */
    divider?: string
    /** Default ellipsis character/text */
    ellipsis?: string
    /** Gap between items in pixels */
    gap?: number
  }

  export interface BreadcrumbsRootSlotProps {
    /** Whether items are being truncated */
    isOverflowing: boolean
    /** Number of items that fit in available space */
    capacity: number
    /** Total number of registered items */
    total: number
    /** Attributes to bind to the root element */
    attrs: {
      'aria-label': 'Breadcrumb'
    }
  }

  export const [useBreadcrumbsRoot, provideBreadcrumbsRoot] = createContext<BreadcrumbsContext>()
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createGroup } from '#v0/composables/createGroup'
  import { createOverflow } from '#v0/composables/useOverflow'

  // Utilities
  import { computed, toRef, useTemplateRef, watch } from 'vue'

  defineOptions({ name: 'BreadcrumbsRoot' })

  defineSlots<{
    default: (props: BreadcrumbsRootSlotProps) => unknown
  }>()

  const {
    namespace = 'v0:breadcrumbs',
    as = 'nav',
    divider = '/',
    ellipsis = '…',
    gap = 8,
  } = defineProps<BreadcrumbsRootProps>()

  const container = useTemplateRef('container')

  // Create Group with enroll: true so items start selected (visible)
  const group = createGroup<BreadcrumbsTicket>({
    enroll: true,
    multiple: true,
  })

  // Create Overflow for width measurement
  const overflow = createOverflow({
    container: () => container.value?.element,
    gap: toRef(() => gap),
    reverse: true, // Prioritize trailing items (current path)
  })

  const isOverflowing = toRef(() => overflow.isOverflowing.value)

  // Watch capacity changes and update selection
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

      // Overflow - need to hide some items and show ellipsis
      // Since reverse: true, capacity counts from the end
      // We need to unselect items from the start that don't fit
      const items = group.values()
      const hiddenCount = size - capacity

      let hidden = 0
      for (const ticket of items) {
        if (ticket.type === 'ellipsis') {
          // Show ellipsis when truncating
          group.select(ticket.id)
        } else if (hidden < hiddenCount) {
          // Hide items from the start
          group.unselect(ticket.id)
          hidden++
        } else {
          // Show remaining items
          if (!ticket.isSelected.value) {
            group.select(ticket.id)
          }
        }
      }
    },
    { immediate: true },
  )

  // Provide context to children
  provideBreadcrumbsRoot(namespace, {
    group,
    overflow,
    divider: computed(() => divider),
    ellipsis: computed(() => ellipsis),
    gap: computed(() => gap),
    isOverflowing,
  })

  const slotProps = toRef((): BreadcrumbsRootSlotProps => ({
    isOverflowing: overflow.isOverflowing.value,
    capacity: overflow.capacity.value,
    total: group.size,
    attrs: {
      'aria-label': 'Breadcrumb',
    },
  }))
</script>

<template>
  <Atom
    ref="container"
    :as
    v-bind="slotProps.attrs"
    class="flex"
    :style="{ gap: `${gap}px` }"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
