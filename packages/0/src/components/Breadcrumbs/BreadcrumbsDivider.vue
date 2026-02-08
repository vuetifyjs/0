/**
 * @module BreadcrumbsDivider
 *
 * @remarks
 * Visual separator between breadcrumb items. Registers with the parent
 * BreadcrumbsRoot and self-measures width. Supports inline override of
 * the global divider character via the divider prop.
 * Renders as a list item by default with aria-hidden.
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

  export interface BreadcrumbsDividerProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Unique identifier (auto-generated if not provided) */
    id?: ID
    /** Override divider character (uses global from Root if not provided) */
    divider?: string
  }

  export interface BreadcrumbsDividerSlotProps {
    /** Unique identifier */
    id: ID
    /** Resolved divider character */
    divider: string
    /** Whether this divider is currently visible */
    isVisible: boolean
    /** Attributes to bind to the divider element */
    attrs: {
      'aria-hidden': 'true'
      'data-visible': true | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BreadcrumbsDivider' })

  defineSlots<{
    default: (props: BreadcrumbsDividerSlotProps) => unknown
  }>()

  const {
    as = 'li',
    renderless,
    namespace = 'v0:breadcrumbs',
    id,
    divider,
  } = defineProps<BreadcrumbsDividerProps>()

  const elRef = useTemplateRef('el')
  const context = useBreadcrumbsRoot(namespace)

  const ticket = context.group.register({
    id,
    type: 'divider' as const,
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

  const resolvedDivider = toRef(() => divider ?? context.divider.value)
  const isVisible = toRef(() => ticket.isSelected.value)

  const slotProps = toRef((): BreadcrumbsDividerSlotProps => ({
    id: ticket.id,
    divider: resolvedDivider.value,
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
      {{ resolvedDivider }}
    </slot>
  </Atom>
</template>
