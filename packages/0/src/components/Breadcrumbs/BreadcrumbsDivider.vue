/**
 * @module BreadcrumbsDivider
 *
 * @see https://0.vuetifyjs.com/components/semantic/breadcrumbs
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

  // Context
  import { useBreadcrumbsRoot } from './BreadcrumbsRoot.vue'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'

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
    /** Whether this divider is currently selected (visible) */
    isSelected: boolean
    /** Attributes to bind to the divider element */
    attrs: {
      'aria-hidden': 'true'
      'data-selected': true | undefined
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
    divider: _divider,
  } = defineProps<BreadcrumbsDividerProps>()

  const elRef = useTemplateRef('el')
  const context = useBreadcrumbsRoot(namespace)

  const ticket = context.group.register({
    id,
    type: 'divider' as const,
  })

  // Width recorded under `last`; a reindex re-keys it without reading a possibly hidden element.
  let width: number | undefined
  let last = ticket.index

  watch(
    () => [elRef.value?.element, ticket.index] as const,
    ([element, index], previous) => {
      const changed = isUndefined(previous) || element !== previous[0]
      width = context.measureElement(index, 'divider', changed ? element ?? undefined : width)
      last = index
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    context.measureElement(last, 'divider', undefined)
    context.group.unregister(ticket.id)
  })

  const divider = toRef(() => _divider ?? context.divider.value)
  const isSelected = toRef(() => ticket.isSelected.value)

  const slotProps = toRef((): BreadcrumbsDividerSlotProps => ({
    id: ticket.id,
    divider: divider.value,
    isSelected: isSelected.value,
    attrs: {
      'aria-hidden': 'true',
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
    <slot v-bind="slotProps">
      {{ divider }}
    </slot>
  </Atom>
</template>
