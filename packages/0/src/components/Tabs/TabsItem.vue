/**
 * @module TabsItem
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
 * h(Tabs.Item, { value: 'profile' }, {
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
  import { nextTick, onUnmounted, toRef, toValue, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { MaybeRef } from 'vue'

  export interface TabsItemProps<V = unknown> extends AtomProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: ID
    /** Value associated with this tab (used to match with TabsPanel) */
    value?: V
    /** Disables this specific tab */
    disabled?: MaybeRef<boolean>
    /** Namespace for dependency injection */
    namespace?: string
    /** Accessible label for this tab */
    ariaLabel?: string
    /** ID of element that labels this tab */
    ariaLabelledby?: string
    /** ID of element that describes this tab */
    ariaDescribedby?: string
  }

  export interface TabsItemSlotProps {
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
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
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
  defineOptions({ name: 'TabsItem', inheritAttrs: false })

  const attrs = useAttrs()
  const rootRef = useTemplateRef<AtomExpose>('root')

  defineSlots<{
    default: (props: TabsItemSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    id,
    value,
    disabled,
    namespace = 'v0:tabs',
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
  } = defineProps<TabsItemProps<V>>()

  const tabs = useTabsRoot(namespace)

  // Vue auto-unwraps exposed refs when accessed via template ref,
  // but TypeScript doesn't reflect this - cast corrects the type
  const el = toRef(() => (rootRef.value?.element as HTMLElement | null | undefined) ?? undefined)
  const ticket = tabs.register({ id, value, disabled, el })

  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(tabs.disabled))

  const tabId = toRef(() => `${tabs.rootId}-tab-${ticket.id}`)
  const panelId = toRef(() => `${tabs.rootId}-panel-${ticket.id}`)

  onUnmounted(() => {
    tabs.unregister(ticket.id)
  })

  function focusSelectedTab () {
    nextTick(() => {
      const selected = tabs.selectedItem.value
      if (selected) {
        toValue(selected.el)?.focus()
      }
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
      focusSelectedTab()
      return
    }

    if (
      (isHorizontal && e.key === 'ArrowLeft') ||
      (!isHorizontal && e.key === 'ArrowUp')
    ) {
      e.preventDefault()
      tabs.prev()
      focusSelectedTab()
      return
    }

    // Home/End navigation
    if (e.key === 'Home') {
      e.preventDefault()
      tabs.first()
      focusSelectedTab()
      return
    }

    if (e.key === 'End') {
      e.preventDefault()
      tabs.last()
      focusSelectedTab()
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

  const slotProps = toRef((): TabsItemSlotProps => ({
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
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
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
    ref="root"
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
