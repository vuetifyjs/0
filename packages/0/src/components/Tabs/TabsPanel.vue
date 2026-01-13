/**
 * @module TabsPanel
 *
 * @remarks
 * Content panel associated with a tab. Matches with TabsTab via the `value`
 * prop. Provides ARIA tabpanel role and labelledby relationship with the
 * corresponding tab trigger.
 *
 * @see {@link https://0.vuetifyjs.com/components/navigation/tabs#panel}
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useTabsRoot, type TabsState } from './TabsRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TabsPanelProps<V = unknown> extends AtomProps {
    /**
     * Value to match with corresponding TabsTab
     *
     * @example
     * ```vue
     * <template>
     *   <Tabs.Tab value="profile">Profile</Tabs.Tab>
     *   <Tabs.Panel value="profile">Profile content</Tabs.Panel>
     * </template>
     * ```
     */
    value: V
    /**
     * Force mount the panel even when not selected (useful for animations)
     *
     * @example
     * ```vue
     * <template>
     *   <Tabs.Panel value="profile" force-mount class="transition-opacity">
     *     Content always in DOM
     *   </Tabs.Panel>
     * </template>
     * ```
     */
    forceMount?: boolean
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface TabsPanelSlotProps {
    /** Whether this panel's tab is currently selected */
    isSelected: boolean
    /** Attributes to bind to the panel element */
    attrs: {
      'id': string
      'role': 'tabpanel'
      'aria-labelledby': string
      'tabindex': 0 | -1
      'hidden': boolean | undefined
      'data-state': TabsState
      'data-selected': true | undefined
    }
  }
</script>

<script lang="ts" setup generic="V = unknown">
  defineOptions({ name: 'TabsPanel' })

  defineSlots<{
    /**
     * Default slot for panel content
     *
     * @example
     * ```vue
     * <template>
     *   <Tabs.Panel v-slot="{ isSelected }" value="profile">
     *     <div :class="{ 'opacity-100': isSelected, 'opacity-0': !isSelected }">
     *       Profile content with custom transitions
     *     </div>
     *   </Tabs.Panel>
     * </template>
     * ```
     */
    default: (props: TabsPanelSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    value,
    forceMount = false,
    namespace = 'v0:tabs',
  } = defineProps<TabsPanelProps<V>>()

  const tabs = useTabsRoot(namespace)

  // Find the ticket that matches this panel's value (O(1) lookup)
  const ticket = toRef(() => {
    // Try value-based lookup first
    const ids = tabs.browse(value)
    if (ids && ids.length > 0) {
      return tabs.get(ids[0]!) ?? null
    }
    // Fall back to ID-based lookup (for valueIsIndex cases)
    return tabs.get(value as string | number) ?? null
  })

  const isSelected = toRef(() => {
    const t = ticket.value
    return t ? toValue(t.isSelected) : false
  })

  const ticketId = toRef(() => ticket.value?.id ?? value)
  const dataState = toRef((): TabsState => isSelected.value ? 'active' : 'inactive')

  const panelId = toRef(() => `${tabs.rootId}-panel-${ticketId.value}`)
  const tabId = toRef(() => `${tabs.rootId}-tab-${ticketId.value}`)

  const slotProps = toRef((): TabsPanelSlotProps => ({
    isSelected: isSelected.value,
    attrs: {
      'id': panelId.value,
      'role': 'tabpanel',
      'aria-labelledby': tabId.value,
      'tabindex': isSelected.value ? 0 : -1,
      'hidden': forceMount ? undefined : !isSelected.value,
      'data-state': dataState.value,
      'data-selected': isSelected.value || undefined,
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
