/**
 * @module BreadcrumbsItem
 *
 * @remarks
 * Individual breadcrumb item that registers with the parent BreadcrumbsRoot.
 * Self-measures width for overflow calculation. Visibility is controlled
 * via selection state (v-show bound to isSelected).
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface BreadcrumbsItemProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Value associated with this item */
    value?: unknown
  }

  export interface BreadcrumbsItemSlotProps {
    /** Unique identifier */
    id: string
    /** Whether this item is currently visible */
    isVisible: boolean
    /** Attributes to bind to the item element */
    attrs: {
      'data-visible': true | undefined
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useBreadcrumbsRoot } from './BreadcrumbsRoot.vue'

  // Utilities
  import { onUnmounted, toRef, toValue, useTemplateRef, watch } from 'vue'

  // Types
  import type { BreadcrumbsTicket } from './types'

  defineOptions({ name: 'BreadcrumbsItem' })

  defineSlots<{
    default: (props: BreadcrumbsItemSlotProps) => unknown
  }>()

  const {
    as = 'li',
    renderless,
    namespace = 'v0:breadcrumbs',
    id,
    value,
  } = defineProps<BreadcrumbsItemProps>()

  const el = useTemplateRef('el')
  const breadcrumbs = useBreadcrumbsRoot(namespace)

  const ticket = breadcrumbs.group.register({
    id,
    value,
    type: 'item',
  } as Partial<BreadcrumbsTicket>)

  // Measure element for overflow calculation
  watch(
    () => el.value?.element,
    element => {
      breadcrumbs.overflow.measure(ticket.index, element ?? undefined)
    },
    { immediate: true },
  )

  onUnmounted(() => {
    breadcrumbs.overflow.measure(ticket.index, undefined)
    breadcrumbs.group.unregister(ticket.id)
  })

  const isVisible = toRef(() => toValue(ticket.isSelected))

  const slotProps = toRef((): BreadcrumbsItemSlotProps => ({
    id: String(ticket.id),
    isVisible: isVisible.value,
    attrs: {
      'data-visible': isVisible.value || undefined,
    },
  }))
</script>

<template>
  <Atom
    v-show="isVisible"
    ref="el"
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
