/**
 * @module BreadcrumbsEllipsis
 *
 * @remarks
 * Ellipsis indicator for truncated breadcrumb items. Registers with
 * BreadcrumbsRoot as type='ellipsis'. Root's watcher controls visibility
 * based on overflow state - hidden when everything fits, shown when truncating.
 * Renders as a list item by default with aria-hidden.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useBreadcrumbsRoot } from './BreadcrumbsRoot.vue'

  // Utilities
  import { onUnmounted, toRef, toValue, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface BreadcrumbsEllipsisProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Unique identifier (auto-generated if not provided) */
    id?: ID
    /** Override ellipsis character (uses global from Root if not provided) */
    ellipsis?: string
  }

  export interface BreadcrumbsEllipsisSlotProps {
    /** Unique identifier */
    id: ID
    /** Resolved ellipsis character */
    ellipsis: string
    /** Whether the ellipsis is visible (items are overflowing) */
    isVisible: boolean
    /** Attributes to bind to the ellipsis element */
    attrs: {
      'aria-hidden': 'true'
      'data-visible': true | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BreadcrumbsEllipsis' })

  defineSlots<{
    default: (props: BreadcrumbsEllipsisSlotProps) => unknown
  }>()

  const {
    as = 'li',
    renderless,
    namespace = 'v0:breadcrumbs',
    id,
    ellipsis,
  } = defineProps<BreadcrumbsEllipsisProps>()

  const elRef = useTemplateRef('el')
  const context = useBreadcrumbsRoot(namespace)

  // Register as ellipsis type - Root's watcher controls visibility based on overflow
  const ticket = context.group.register({
    id,
    type: 'ellipsis' as const,
  })

  // Measure element for overflow calculation
  watch(
    () => elRef.value?.element,
    element => {
      context.overflow.measure(ticket.index, element ?? undefined)
    },
    { immediate: true },
  )

  onUnmounted(() => {
    context.overflow.measure(ticket.index, undefined)
    context.group.unregister(ticket.id)
  })

  const resolvedEllipsis = toRef(() => ellipsis ?? context.ellipsis.value)
  const isVisible = toRef(() => toValue(ticket.isSelected))

  const slotProps = toRef((): BreadcrumbsEllipsisSlotProps => ({
    id: ticket.id,
    ellipsis: resolvedEllipsis.value,
    isVisible: isVisible.value,
    attrs: {
      'aria-hidden': 'true',
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
    <slot v-bind="slotProps">
      {{ resolvedEllipsis }}
    </slot>
  </Atom>
</template>
