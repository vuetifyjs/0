/**
 * @module TabsList
 *
 * @remarks
 * Container component for tab triggers. Provides the `tablist` ARIA role
 * and orientation attribute for accessibility. Does not manage state -
 * purely structural.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useTabsRoot } from './TabsRoot.vue'

  // Utilities
  import { toRef } from 'vue'

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
    /** Attributes to bind to the tablist element */
    attrs: {
      'role': 'tablist'
      'aria-orientation': TabsOrientation
      'aria-label': string | undefined
    }
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'TabsList' })

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

  const slotProps = toRef((): TabsListSlotProps => ({
    orientation: tabs.orientation.value,
    attrs: {
      'role': 'tablist',
      'aria-orientation': tabs.orientation.value,
      'aria-label': label,
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
