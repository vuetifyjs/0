<script lang="ts">
  /**
   * @module OverflowRoot
   *
   * @see https://0.vuetifyjs.com/components/semantic/overflow
   *
   * Root component for the Overflow primitive. Owns the createOverflow context,
   * the child Item registry, and the capacity computation that drives item
   * visibility and the indicator's appearance.
   *
   * @remarks
   * Visibility is computed against the *non-disabled* sibling order: a disabled
   * Item is exempt from capacity math and never counts against the cap, so the
   * Items around it occupy the same number of visible slots regardless of where
   * the disabled Item sits. The reactive `gap` prop is forwarded to
   * `createOverflow` as a getter so capacity recomputes when the prop changes.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createOverflow } from '#v0/composables/createOverflow'
  import { createRegistry } from '#v0/composables/createRegistry'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { computed, shallowRef, toRef, toValue, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { OverflowPriority, OverflowRootContext, OverflowTicket, OverflowTicketInput } from './types'

  export interface OverflowRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Pixel gap between items (mirror of CSS gap) */
    gap?: number
    /** Side that keeps items when overflow occurs */
    priority?: OverflowPriority
    /** Disable truncation; render everything */
    disabled?: boolean
  }

  export interface OverflowRootSlotProps {
    capacity: number
    size: number
    isOverflowing: boolean
    attrs: {
      'data-overflow': true | undefined
      'data-priority': OverflowPriority
    }
  }

  export const [useOverflowRoot, provideOverflowRoot] = createContext<OverflowRootContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'OverflowRoot' })

  defineSlots<{
    default: (props: OverflowRootSlotProps) => unknown
  }>()

  const {
    namespace = 'v0:overflow',
    as = 'div',
    renderless = false,
    gap = 0,
    priority = 'start',
    disabled = false,
  } = defineProps<OverflowRootProps>()

  const containerRef = useTemplateRef<AtomExpose>('container')
  const indicatorWidth = shallowRef(0)

  const registry = createRegistry<OverflowTicketInput, OverflowTicket>({ reactive: true })

  const overflow = createOverflow({
    container: () => toElement(containerRef.value?.element),
    gap: () => gap,
    reserved: indicatorWidth,
    reverse: () => priority === 'end',
  })

  // Cache the hidden set; O(1) lookup avoids the per-item O(n) rank scan (O(n²) per resize).
  const hidden = computed(() => {
    const set = new Set<number>()
    if (disabled) return set
    const cap = overflow.capacity.value
    if (cap === Infinity) return set

    const tickets = registry.values()
    const enabled: number[] = []
    for (const [i, ticket] of tickets.entries()) {
      if (!toValue(ticket.disabled)) enabled.push(i)
    }

    const total = enabled.length
    for (let rank = 0; rank < total; rank++) {
      const visible = priority === 'end' ? rank >= total - cap : rank < cap
      if (!visible) set.add(enabled[rank])
    }

    return set
  })

  function isVisible (index: number): boolean {
    return !hidden.value.has(index)
  }

  provideOverflowRoot(namespace, {
    overflow,
    registry,
    priority: toRef(() => priority),
    disabled: toRef(() => disabled),
    indicatorWidth,
    isOverflowing: overflow.isOverflowing,
    isVisible,
  })

  const slotProps = toRef((): OverflowRootSlotProps => ({
    capacity: overflow.capacity.value,
    size: registry.size,
    isOverflowing: overflow.isOverflowing.value,
    attrs: {
      'data-overflow': overflow.isOverflowing.value || undefined,
      'data-priority': priority,
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
