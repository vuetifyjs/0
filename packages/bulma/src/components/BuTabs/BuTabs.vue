<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs } from 'vue'

  export interface BuTabsProps {
    /** Centers the tab list */
    centered?: boolean
    /** Boxed (bordered) tab style */
    boxed?: boolean
    /** Mutually-exclusive toggle button style */
    toggle?: boolean
    /** Size modifier */
    size?: 'small' | 'normal' | 'medium' | 'large'
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'BuTabs', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    /** BuTab items — rendered inside the tab list `<ul>` */
    default: () => any
    /** BuTabPanel content — rendered after `.tabs`, still inside the tabs context */
    panels?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: T]
  }>()

  const {
    centered = false,
    boxed = false,
    toggle = false,
    size,
  } = defineProps<BuTabsProps>()

  const model = defineModel<T>()

  const classes = toRef(() => [
    size && `is-${size}`,
    centered && 'is-centered',
    boxed && 'is-boxed',
    toggle && 'is-toggle',
  ])
</script>

<template>
  <Tabs.Root v-model="model">
    <div
      class="tabs"
      :class="classes"
      v-bind="attrs"
    >
      <Tabs.List as="ul">
        <slot />
      </Tabs.List>
    </div>

    <slot name="panels" />
  </Tabs.Root>
</template>
