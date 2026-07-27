/**
 * @module BreadcrumbsActivator
 *
 * @see https://0.vuetifyjs.com/components/semantic/breadcrumbs
 *
 * @remarks
 * Disclosure control that reveals the crumbs hidden by truncation. Belongs
 * inside a BreadcrumbsEllipsis, which stays the list item — putting button
 * semantics on the `li` itself would replace its `listitem` role and break the
 * owning list's required children.
 *
 * Its presence is what makes the ellipsis reachable: without an Activator the
 * ellipsis stays `aria-hidden` and purely decorative.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useBreadcrumbsRoot } from './BreadcrumbsRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { onBeforeUnmount, toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface BreadcrumbsActivatorProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface BreadcrumbsActivatorSlotProps {
    /** Whether the collapsed crumbs are currently revealed */
    isExpanded: boolean
    /** Number of breadcrumb items hidden by truncation */
    count: number
    /** Toggle visibility of the collapsed crumbs */
    toggle: () => void
    /** Attributes to bind to the activator element */
    attrs: {
      'type': 'button' | undefined
      'role': 'button' | undefined
      'tabindex': 0 | undefined
      'aria-expanded': boolean
      'aria-label': string
      'data-state': 'open' | 'closed'
      'onClick': () => void
      'onKeydown': ((e: KeyboardEvent) => void) | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BreadcrumbsActivator' })

  defineSlots<{
    default: (props: BreadcrumbsActivatorSlotProps) => unknown
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:breadcrumbs',
  } = defineProps<BreadcrumbsActivatorProps>()

  const locale = useLocale()
  const context = useBreadcrumbsRoot(namespace)

  // Registering is what tells the ellipsis it hosts a disclosure rather than
  // decoration — the registry is the Root's view of its child tree.
  const ticket = context.group.register({ type: 'activator' as const })

  onBeforeUnmount(() => {
    context.group.unregister(ticket.id)
  })

  const isExpanded = toRef(() => context.expanded.value)
  const count = toRef(() => context.hiddenCount.value)

  const label = toRef(() =>
    locale.ti('Breadcrumbs.expand', { count: count.value }) ?? `Show ${count.value} more breadcrumbs`,
  )

  function toggle () {
    context.expanded.value = !context.expanded.value
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key !== 'Enter' && e.key !== ' ') return

    e.preventDefault()
    toggle()
  }

  const slotProps = toRef((): BreadcrumbsActivatorSlotProps => ({
    isExpanded: isExpanded.value,
    count: count.value,
    toggle,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'role': as === 'button' ? undefined : 'button',
      'tabindex': as === 'button' ? undefined : 0,
      'aria-expanded': isExpanded.value,
      'aria-label': label.value,
      'data-state': isExpanded.value ? 'open' : 'closed',
      'onClick': toggle,
      'onKeydown': as === 'button' ? undefined : onKeydown,
    },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
