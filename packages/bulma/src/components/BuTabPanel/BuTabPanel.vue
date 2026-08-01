<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  export interface BuTabPanelProps<V = unknown> {
    /** Value matched against the corresponding BuTab */
    value: V
  }

  export interface BuTabPanelSlotProps {
    /** Whether this panel's tab is currently selected */
    isSelected: boolean
  }
</script>

<script lang="ts" setup generic="V = unknown">
  defineOptions({ name: 'BuTabPanel' })

  defineSlots<{
    default: (props: BuTabPanelSlotProps) => any
  }>()

  const { value } = defineProps<BuTabPanelProps<V>>()
</script>

<template>
  <Tabs.Panel
    v-slot="{ isSelected }"
    :value
  >
    <slot :is-selected />
  </Tabs.Panel>
</template>
