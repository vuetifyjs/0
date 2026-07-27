/**
 * @module BreadcrumbsEllipsis
 *
 * @see https://0.vuetifyjs.com/components/semantic/breadcrumbs
 *
 * @remarks
 * Ellipsis indicator for truncated breadcrumb items. Registers with
 * BreadcrumbsRoot as type='ellipsis'. Root's watcher controls visibility
 * based on overflow state - hidden when everything fits, shown when truncating.
 * Renders as a list item by default with aria-hidden.
 *
 * Decorative by default. Place a BreadcrumbsActivator inside it to turn the
 * trail's truncation into a disclosure — the ellipsis stays the list item, so
 * button semantics never land on the `li` itself where they would replace its
 * `listitem` role.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useBreadcrumbsRoot } from './BreadcrumbsRoot.vue'

  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'

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
    /** Whether the ellipsis is currently selected (visible) */
    isSelected: boolean
    /** Number of breadcrumb items hidden by truncation */
    count: number
    /** Attributes to bind to the ellipsis element */
    attrs: {
      'aria-hidden': 'true' | undefined
      'data-selected': true | undefined
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

  const ticket = context.group.register({
    id,
    type: 'ellipsis' as const,
  })

  watch(
    () => elRef.value?.element,
    element => {
      if (!IN_BROWSER || !element) {
        context.ellipsisWidth.value = 0
        return
      }

      const el = element as HTMLElement
      const style = getComputedStyle(el)
      const marginX = (Number.parseFloat(style.marginLeft) || 0) + (Number.parseFloat(style.marginRight) || 0)
      context.ellipsisWidth.value = (el.offsetWidth || 0) + marginX
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    context.ellipsisWidth.value = 0
    context.group.unregister(ticket.id)
  })

  const resolvedEllipsis = toRef(() => ellipsis ?? context.ellipsis.value)
  const isSelected = toRef(() => ticket.isSelected.value)
  const count = toRef(() => context.hiddenCount.value)

  const slotProps = toRef((): BreadcrumbsEllipsisSlotProps => ({
    id: ticket.id,
    ellipsis: resolvedEllipsis.value,
    isSelected: isSelected.value,
    count: count.value,
    attrs: {
      // A decorative ellipsis stays out of the a11y tree; hosting an Activator
      // makes it the disclosure, which has to be reachable.
      'aria-hidden': context.hasActivator.value ? undefined : 'true',
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
      {{ resolvedEllipsis }}
    </slot>
  </Atom>
</template>
