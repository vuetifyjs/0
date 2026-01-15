/**
 * @module TabsList
 *
 * @remarks
 * Container component for tab triggers. Provides the `tablist` ARIA role
 * and orientation attribute for accessibility. Does not manage state -
 * purely structural.
 *
 * @example
 * ```ts
 * // Basic usage with label for accessibility
 * h(Tabs.List, { label: 'Account settings' }, () => [
 *   h(Tabs.Tab, { value: 'profile' }, () => 'Profile'),
 *   h(Tabs.Tab, { value: 'password' }, () => 'Password'),
 * ])
 * ```
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useTabsRoot } from './TabsRoot.vue'

  // Utilities
  import { toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { TabsOrientation } from './TabsRoot.vue'

  export interface TabsListProps extends AtomProps {
    /** Accessible label for the tablist */
    label?: string
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
      'aria-disabled': boolean | undefined
      'data-disabled': true | undefined
    }
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'TabsList', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: TabsListSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    label,
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
      'aria-disabled': isDisabled.value || undefined,
      'data-disabled': isDisabled.value || undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
