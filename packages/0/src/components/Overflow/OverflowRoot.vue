<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createOverflow } from '#v0/composables/createOverflow'
  import { createRegistry } from '#v0/composables/createRegistry'

  // Utilities
  import { shallowRef, toRef, useTemplateRef } from 'vue'

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
      'data-overflow': 'true' | undefined
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
    renderless,
    gap = 0,
    priority = 'start',
    disabled = false,
  } = defineProps<OverflowRootProps>()

  const containerRef = useTemplateRef<AtomExpose>('container')
  const indicatorWidth = shallowRef(0)

  const registry = createRegistry<OverflowTicketInput, OverflowTicket>()

  const overflow = createOverflow({
    container: () => containerRef.value?.element as Element | undefined,
    gap,
    reserved: () => indicatorWidth.value,
    reverse: () => priority === 'end',
  })

  const _priority = toRef(() => priority)
  const _disabled = toRef(() => disabled)

  function isVisible (index: number): boolean {
    if (disabled) return true
    const cap = overflow.capacity.value
    if (cap === Infinity) return true
    if (priority === 'end') {
      return index >= registry.size - cap
    }
    return index < cap
  }

  provideOverflowRoot(namespace, {
    overflow,
    registry,
    priority: _priority,
    disabled: _disabled,
    indicatorWidth,
    isOverflowing: overflow.isOverflowing,
    isVisible,
  })

  const slotProps = toRef((): OverflowRootSlotProps => ({
    capacity: overflow.capacity.value,
    size: registry.size,
    isOverflowing: overflow.isOverflowing.value,
    attrs: {
      'data-overflow': overflow.isOverflowing.value ? 'true' : undefined,
      'data-priority': priority,
    },
  }))
</script>

<template>
  <Atom
    ref="container"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
