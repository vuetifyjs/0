/**
 * @module BreadcrumbsItem
 *
 * @remarks
 * Individual breadcrumb item that registers with the parent BreadcrumbsRoot.
 * Registers with both the breadcrumbs composable (navigation model) and the
 * group context (overflow visibility). Self-measures width for overflow calculation.
 * Visibility is controlled via group selection state (v-show bound to isSelected from the group ticket).
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useBreadcrumbsRoot } from './BreadcrumbsRoot.vue'

  // Utilities
  import { onUnmounted, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface BreadcrumbsItemProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Unique identifier (auto-generated if not provided) */
    id?: ID
    /** Value associated with this item */
    value?: unknown
    /** Display text for the breadcrumb (used by composable model) */
    text?: string
  }

  export interface BreadcrumbsItemSlotProps {
    /** Unique identifier */
    id: ID
    /** Whether this item is currently selected (visible) */
    isSelected: boolean
    /** Attributes to bind to the item element */
    attrs: {
      'data-selected': true | undefined
    }
  }
</script>

<script setup lang="ts">
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
    text = '',
  } = defineProps<BreadcrumbsItemProps>()

  const elRef = useTemplateRef('el')
  const context = useBreadcrumbsRoot(namespace)

  // Register with breadcrumbs composable (navigation model)
  const crumb = context.breadcrumbs.register({
    id,
    value,
    text,
  })

  // Register with group context (overflow visibility)
  const ticket = context.group.register({
    id: crumb.id,
    value,
    type: 'item' as const,
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
    context.breadcrumbs.unregister(crumb.id)
  })

  const isSelected = toRef(() => ticket.isSelected.value)

  const slotProps = toRef((): BreadcrumbsItemSlotProps => ({
    id: ticket.id,
    isSelected: isSelected.value,
    attrs: {
      'data-selected': isSelected.value || undefined,
    },
  }))
</script>

<template>
  <Atom
    v-show="isSelected"
    ref="el"
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
