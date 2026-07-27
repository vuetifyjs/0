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
 * With the `interactive` prop it hosts a disclosure toggle that reveals the
 * collapsed items. The button is nested inside the list item rather than
 * applied to it — `role="button"` on the `li` would replace its `listitem`
 * role and break the owning list's required children.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useBreadcrumbsRoot } from './BreadcrumbsRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

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
    /** Make the ellipsis a disclosure toggle that reveals collapsed items */
    interactive?: boolean
  }

  export interface BreadcrumbsEllipsisSlotProps {
    /** Unique identifier */
    id: ID
    /** Resolved ellipsis character */
    ellipsis: string
    /** Whether the ellipsis is currently selected (visible) */
    isSelected: boolean
    /** Whether collapsed items are currently revealed (interactive only) */
    isExpanded: boolean
    /** Number of breadcrumb items hidden by truncation */
    count: number
    /** Toggle visibility of collapsed items (interactive only) */
    toggle: () => void
    /** Attributes to bind to the ellipsis list item */
    attrs: {
      'aria-hidden': 'true' | undefined
      'data-selected': true | undefined
    }
    /**
     * Attributes for the nested disclosure control (interactive only). Bind
     * these to a native `button` — the list item itself must keep its
     * `listitem` role, so the button semantics live on a child element.
     */
    triggerAttrs: {
      'type': 'button' | undefined
      'aria-expanded': boolean | undefined
      'aria-label': string | undefined
      'data-state': 'open' | 'closed' | undefined
      'onClick': (() => void) | undefined
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
    interactive,
  } = defineProps<BreadcrumbsEllipsisProps>()

  const locale = useLocale()
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
  const isExpanded = toRef(() => context.expanded.value)

  const count = toRef(() => context.hiddenCount.value)

  function toggle () {
    context.expanded.value = !context.expanded.value
  }

  const slotProps = toRef((): BreadcrumbsEllipsisSlotProps => ({
    id: ticket.id,
    ellipsis: resolvedEllipsis.value,
    isSelected: isSelected.value,
    isExpanded: isExpanded.value,
    count: count.value,
    toggle,
    attrs: {
      'aria-hidden': interactive ? undefined : 'true',
      'data-selected': isSelected.value || undefined,
    },
    triggerAttrs: {
      'type': interactive ? 'button' : undefined,
      'aria-expanded': interactive ? isExpanded.value : undefined,
      'aria-label': interactive
        ? locale.ti('Breadcrumbs.expand', { count: count.value }) ?? `Show ${count.value} more breadcrumbs`
        : undefined,
      'data-state': interactive ? (isExpanded.value ? 'open' : 'closed') : undefined,
      'onClick': interactive ? toggle : undefined,
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
    <Atom
      v-if="interactive && !renderless"
      as="button"
      v-bind="slotProps.triggerAttrs"
    >
      <slot v-bind="slotProps">
        {{ resolvedEllipsis }}
      </slot>
    </Atom>

    <slot v-else v-bind="slotProps">
      {{ resolvedEllipsis }}
    </slot>
  </Atom>
</template>
