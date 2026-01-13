/**
 * @module TabsList
 *
 * @remarks
 * Container component for tab triggers. Provides the `tablist` ARIA role
 * and orientation attribute for accessibility. Does not manage state -
 * purely structural.
 *
 * @see {@link https://0.vuetifyjs.com/components/navigation/tabs#list}
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useTabsRoot } from './TabsRoot.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { TabsOrientation } from './TabsRoot.vue'

  export interface TabsListProps extends AtomProps {
    /**
     * Accessible label for the tablist
     *
     * @example
     * ```vue
     * <template>
     *   <Tabs.List label="Navigation">
     *     <Tabs.Tab value="home">Home</Tabs.Tab>
     *   </Tabs.List>
     * </template>
     * ```
     */
    label?: string
    /**
     * ID of element that labels this tablist
     *
     * @example
     * ```vue
     * <template>
     *   <h2 id="tabs-heading">Settings</h2>
     *   <Tabs.List aria-labelledby="tabs-heading">
     *     <Tabs.Tab value="profile">Profile</Tabs.Tab>
     *   </Tabs.List>
     * </template>
     * ```
     */
    ariaLabelledby?: string
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface TabsListSlotProps {
    /** Current orientation */
    orientation: TabsOrientation
    /** Whether the tabs instance is disabled */
    isDisabled: boolean
    /** Attributes to bind to the tablist element */
    attrs: {
      'role': 'tablist'
      'aria-orientation': TabsOrientation
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-disabled': boolean | undefined
    }
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'TabsList' })

  defineSlots<{
    /**
     * Default slot for tab triggers
     *
     * @example
     * ```vue
     * <template>
     *   <Tabs.List v-slot="{ orientation }">
     *     <div :class="orientation === 'vertical' ? 'flex-col' : 'flex-row'">
     *       <Tabs.Tab value="a">Tab A</Tabs.Tab>
     *     </div>
     *   </Tabs.List>
     * </template>
     * ```
     */
    default: (props: TabsListSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    label,
    ariaLabelledby,
    namespace = 'v0:tabs',
  } = defineProps<TabsListProps>()

  const tabs = useTabsRoot(namespace)

  const isDisabled = toRef(() => toValue(tabs.disabled))

  const slotProps = toRef((): TabsListSlotProps => ({
    orientation: tabs.orientation.value,
    isDisabled: isDisabled.value,
    attrs: {
      'role': 'tablist',
      'aria-orientation': tabs.orientation.value,
      'aria-label': label,
      'aria-labelledby': ariaLabelledby,
      'aria-disabled': isDisabled.value || undefined,
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
