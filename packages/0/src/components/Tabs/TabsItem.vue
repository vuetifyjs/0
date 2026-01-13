/**
 * @module TabsItem
 *
 * @remarks
 * Individual tab trigger that registers with the parent TabsRoot.
 * Provides complete ARIA attributes, roving tabindex, and keyboard
 * handling for accessibility. Supports both automatic and manual
 * activation modes.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useTabsRoot, type TabsState } from './TabsRoot.vue'

  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { onBeforeUnmount, toRef, toValue, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'
  import type { MaybeRef, Ref } from 'vue'

  export interface TabsItemContext {
    /** Unique identifier */
    readonly id: ID
    /** Value associated with this tab */
    readonly value: unknown
    /** Whether this tab is currently selected */
    isSelected: Readonly<Ref<boolean>>
    /** Whether this tab is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Select this tab */
    select: () => void
  }

  export const [useTabsItem, provideTabsItem] = createContext<TabsItemContext>()

  export interface TabsItemProps<V = unknown> extends AtomProps {
    /**
     * Unique identifier (auto-generated if not provided)
     *
     * @example
     * ```vue
     * <template>
     *   <Tabs.Item id="custom-id" value="profile">Profile</Tabs.Item>
     * </template>
     * ```
     */
    id?: ID
    /**
     * Value associated with this tab (used to match with TabsPanel)
     *
     * @example
     * ```vue
     * <template>
     *   <Tabs.Item value="profile">Profile</Tabs.Item>
     *   <Tabs.Panel value="profile">Profile content</Tabs.Panel>
     * </template>
     * ```
     */
    value?: V
    /**
     * Disables this specific tab
     *
     * @example
     * ```vue
     * <template>
     *   <Tabs.Item value="billing" disabled>Billing</Tabs.Item>
     * </template>
     * ```
     */
    disabled?: MaybeRef<boolean>
    /** Namespace for connecting to parent Tabs.Root */
    namespace?: string
    /** Namespace for context provision to children (Indicator) */
    itemNamespace?: string
  }

  export interface TabsItemSlotProps {
    /** Unique identifier */
    id: ID
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
      'data-state': TabsState
      'data-selected': true | undefined
      'data-disabled': true | undefined
      'data-tab-id': ID
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

  const itemRef = useTemplateRef<AtomExpose>('item')

  defineSlots<{
    /**
     * Default slot with tab state, actions, and ARIA attributes
     *
     * @example
     * ```vue
     * <template>
     *   <Tabs.Item v-slot="{ isSelected, attrs }" value="profile">
     *     <button v-bind="attrs" :class="{ 'font-bold': isSelected }">
     *       Profile
     *     </button>
     *   </Tabs.Item>
     * </template>
     * ```
     */
    default: (props: TabsItemSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    id,
    value,
    disabled,
    namespace = 'v0:tabs',
    itemNamespace = 'v0:tabs:item',
  } = defineProps<TabsItemProps<V>>()

  const tabs = useTabsRoot(namespace)

  // Register with parent context (el ref for focus management)
  // Vue auto-unwraps exposed refs when accessed via template ref,
  // but TypeScript doesn't reflect this - cast corrects the type
  const el = toRef(() => (itemRef.value?.element as HTMLElement | null | undefined) ?? undefined)
  const ticket = tabs.register({ id, value, disabled, el })

  const isSelected = toRef(() => toValue(ticket.isSelected))
  const isDisabled = toRef(() => toValue(ticket.disabled) || toValue(tabs.disabled))
  const dataState = toRef((): TabsState => isSelected.value ? 'active' : 'inactive')

  const tabId = toRef(() => `${tabs.rootId}-tab-${ticket.id}`)
  const panelId = toRef(() => `${tabs.rootId}-panel-${ticket.id}`)

  onBeforeUnmount(() => {
    tabs.unregister(ticket.id)
  })

  // Provide context to child components (Indicator)
  const context: TabsItemContext = {
    id: ticket.id,
    value,
    isSelected,
    isDisabled,
    select: ticket.select,
  }

  provideTabsItem(itemNamespace, context)

  /**
   * Focus the currently selected tab using stored element refs
   * This is more robust than DOM queries as it doesn't rely on ARIA attributes
   */
  function focusSelectedTab () {
    // Find the selected ticket and focus its element
    for (const item of tabs.values()) {
      if (toValue(item.isSelected)) {
        toValue(item.el)?.focus()
        return
      }
    }
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
    id: ticket.id,
    isSelected: isSelected.value,
    isDisabled: isDisabled.value,
    select: ticket.select,
    attrs: {
      'id': tabId.value,
      'role': 'tab',
      'tabindex': isSelected.value ? 0 : -1,
      'aria-selected': isSelected.value,
      'aria-controls': panelId.value,
      'aria-disabled': isDisabled.value || undefined,
      'data-state': dataState.value,
      'data-selected': isSelected.value || undefined,
      'data-disabled': isDisabled.value || undefined,
      'data-tab-id': ticket.id,
      'disabled': as === 'button' ? isDisabled.value : undefined,
      'type': as === 'button' ? 'button' : undefined,
      'onClick': onClick,
      'onKeydown': onKeydown,
      'onFocus': onFocus,
    },
  }))
</script>

<template>
  <Atom
    ref="item"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
