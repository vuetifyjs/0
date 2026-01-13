/**
 * @module BreadcrumbsDivider
 *
 * @remarks
 * Visual separator between breadcrumb items. Registers with the parent
 * BreadcrumbsRoot and self-measures width. Supports inline override of
 * the global divider character via the divider prop.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface BreadcrumbsDividerProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Override divider character (uses global from Root if not provided) */
    divider?: string
  }

  export interface BreadcrumbsDividerSlotProps {
    /** Unique identifier */
    id: string
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
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useBreadcrumbsRoot } from './BreadcrumbsRoot.vue'

  // Utilities
  import { onUnmounted, toRef, toValue, useTemplateRef, watch } from 'vue'

  // Types
  import type { BreadcrumbsTicket } from './types'

  defineOptions({ name: 'BreadcrumbsDivider' })

  defineSlots<{
    default: (props: BreadcrumbsDividerSlotProps) => unknown
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:breadcrumbs',
    id,
    divider,
  } = defineProps<BreadcrumbsDividerProps>()

  const el = useTemplateRef('el')
  const breadcrumbs = useBreadcrumbsRoot(namespace)

  const ticket = breadcrumbs.group.register({
    id,
    type: 'divider',
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

  const resolvedDivider = toRef(() => divider ?? breadcrumbs.divider.value)
  const isVisible = toRef(() => toValue(ticket.isSelected))

  const slotProps = toRef((): BreadcrumbsDividerSlotProps => ({
    id: String(ticket.id),
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
