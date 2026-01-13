/**
 * @module TabsIndicator
 *
 * @remarks
 * Visual indicator component for tabs. Must be used within a
 * Tabs.Item component which provides the tab state. Renders as
 * a span by default and only displays when the tab is selected.
 *
 * @see {@link https://0.vuetifyjs.com/components/navigation/tabs#indicator}
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { TabsState } from './TabsRoot.vue'

  export interface TabsIndicatorProps extends AtomProps {
    /** Namespace for context injection from parent Tabs.Item */
    namespace?: string
    /**
     * Force the indicator to always render (useful for CSS transitions)
     *
     * @example
     * ```vue
     * <template>
     *   <Tabs.Indicator force-mount class="transition-opacity data-[state=inactive]:opacity-0" />
     * </template>
     * ```
     */
    forceMount?: boolean
  }

  export interface TabsIndicatorSlotProps {
    /** Whether this tab is currently selected */
    isSelected: boolean
    /** Attributes to bind to the indicator element */
    attrs: {
      'data-state': TabsState
      'style': { display: 'block' | 'none' } | undefined
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { useTabsItem } from './TabsItem.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'TabsIndicator' })

  defineSlots<{
    /**
     * Default slot for custom indicator content
     *
     * @example
     * ```vue
     * <template>
     *   <Tabs.Indicator v-slot="{ isSelected }">
     *     <span :class="isSelected ? 'bg-blue-500' : 'bg-transparent'" />
     *   </Tabs.Indicator>
     * </template>
     * ```
     */
    default: (props: TabsIndicatorSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:tabs:item',
    forceMount = false,
  } = defineProps<TabsIndicatorProps>()

  const item = useTabsItem(namespace)

  const isSelected = toRef(() => toValue(item.isSelected))
  const dataState = toRef((): TabsState => isSelected.value ? 'active' : 'inactive')

  const slotProps = toRef((): TabsIndicatorSlotProps => ({
    isSelected: isSelected.value,
    attrs: {
      'data-state': dataState.value,
      'style': forceMount ? undefined : { display: isSelected.value ? 'block' : 'none' },
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
