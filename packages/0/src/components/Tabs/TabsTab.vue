/**
 * @module TabsTab
 *
 * @remarks
 * Individual tab trigger that registers with the parent TabsRoot.
 * Provides complete ARIA attributes, roving tabindex, and keyboard
 * handling for accessibility. Supports both automatic and manual
 * activation modes.
 *
 * @example
 * ```ts
 * // Using slot props for conditional styling
 * h(Tabs.Tab, { value: 'profile' }, {
 *   default: ({ isSelected }) => h('button', {
 *     class: isSelected ? 'border-b-2 border-blue-500' : ''
 *   }, 'Profile')
 * })
 * ```
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useTabsRoot } from './TabsRoot.vue'

  // Utilities
  import { nextTick, onBeforeUnmount, toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { MaybeRef } from 'vue'

  export interface TabsTabProps<V = unknown> extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /** Value associated with this tab (used to match with TabsPanel) */
    value?: V
    /** Disables this specific tab */
    disabled?: MaybeRef<boolean>
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface TabsTabSlotProps {
    /** Unique identifier */
    id: string
    /** Whether this tab is currently selected */
    isSelected: boolean
    /** Whether this tab is disabled */
    isDisabled: boolean
    /** Select this tab */
    select: () => void
    /** Attributes to bind to the tab element */
    attrs: {
      'id': string
      'role': 'tab'
      'tabindex': 0 | -1
      'aria-selected': boolean
      'aria-controls': string
      'aria-disabled': boolean | undefined
      'data-selected': true | undefined
      'data-disabled': true | undefined
      'disabled': boolean | undefined
      'type': 'button' | undefined
      'onClick': () => void
      'onKeydown': (e: KeyboardEvent) => void
      'onFocus': () => void
    }
  }
</script>

<script lang="ts" setup generic="V = unknown">
  defineOptions({ name: 'TabsTab' })

  defineSlots<{
    default: (props: TabsTabSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    id,
    value,
    disabled,
    namespace = 'v0:tabs',
  } = defineProps<TabsTabProps<V>>()

  const tabs = useTabsRoot(namespace)
  const ticket = tabs.register({ id, value, disabled })

  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(tabs.disabled))

  const tabId = toRef(() => `${tabs.rootId}-tab-${ticket.id}`)
  const panelId = toRef(() => `${tabs.rootId}-panel-${ticket.id}`)

  onBeforeUnmount(() => {
    tabs.unregister(ticket.id)
  })

  function focusSelectedTab (currentTarget: EventTarget | null) {
    nextTick(() => {
      const current = currentTarget as HTMLElement | null
      const tablist = current?.closest('[role="tablist"]')
      const selectedTab = tablist?.querySelector('[role="tab"][aria-selected="true"]') as HTMLElement | null
      selectedTab?.focus()
    })
  }

  function onKeydown (e: KeyboardEvent) {
    const orientation = tabs.orientation.value
    const isHorizontal = orientation === 'horizontal'

    // Arrow key navigation
    if (
      (isHorizontal && e.key === 'ArrowRight') ||
      (!isHorizontal && e.key === 'ArrowDown')
    ) {
      e.preventDefault()
      tabs.next()
      focusSelectedTab(e.currentTarget)
      return
    }

    if (
      (isHorizontal && e.key === 'ArrowLeft') ||
      (!isHorizontal && e.key === 'ArrowUp')
    ) {
      e.preventDefault()
      tabs.prev()
      focusSelectedTab(e.currentTarget)
      return
    }

    // Home/End navigation
    if (e.key === 'Home') {
      e.preventDefault()
      tabs.first()
      focusSelectedTab(e.currentTarget)
      return
    }

    if (e.key === 'End') {
      e.preventDefault()
      tabs.last()
      focusSelectedTab(e.currentTarget)
      return
    }

    // Manual activation
    if (tabs.activation.value === 'manual' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      ticket.select()
    }
  }

  function onClick () {
    if (!isDisabled.value) {
      ticket.select()
    }
  }

  function onFocus () {
    // Automatic activation: select on focus
    if (tabs.activation.value === 'automatic' && !isDisabled.value) {
      ticket.select()
    }
  }

  const slotProps = toRef((): TabsTabSlotProps => ({
    id: String(ticket.id),
    isSelected: toValue(ticket.isSelected),
    isDisabled: toValue(isDisabled),
    select: ticket.select,
    attrs: {
      'id': tabId.value,
      'role': 'tab',
      'tabindex': toValue(ticket.isSelected) ? 0 : -1,
      'aria-selected': toValue(ticket.isSelected),
      'aria-controls': panelId.value,
      'aria-disabled': toValue(isDisabled) || undefined,
      'data-selected': toValue(ticket.isSelected) || undefined,
      'data-disabled': toValue(isDisabled) || undefined,
      'disabled': as === 'button' ? toValue(isDisabled) : undefined,
      'type': as === 'button' ? 'button' : undefined,
      'onClick': onClick,
      'onKeydown': onKeydown,
      'onFocus': onFocus,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
