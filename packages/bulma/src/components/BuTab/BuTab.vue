<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Utilities
  import { useAttrs, useTemplateRef } from 'vue'

  export interface BuTabProps<V = unknown> {
    /** Value matched against the BuTabs v-model and BuTabPanel */
    value?: V
    /** Disables this tab */
    disabled?: boolean
  }

  export interface BuTabSlotProps {
    /** Whether this tab is currently selected */
    isSelected: boolean
  }
</script>

<script lang="ts" setup generic="V = unknown">
  defineOptions({ name: 'BuTab', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: BuTabSlotProps) => any
  }>()

  const {
    value,
    disabled = false,
  } = defineProps<BuTabProps<V>>()

  const anchor = useTemplateRef('anchor')
</script>

<template>
  <!--
    :as="null" (NOT the renderless prop): `as` feeds TabsItem's button
    polyfill, so `renderless` alone would emit type="button" + disabled onto
    the anchor. :el points arrow-key focus at the <a>. role="presentation"
    lifts the <li> out of the accessibility tree so role=tablist directly
    owns the role=tab anchors (axe aria-required-children/-parent).
  -->
  <Tabs.Item
    v-slot="{ isSelected, attrs: tab }"
    :as="null"
    :disabled
    :el="anchor"
    :value
  >
    <li
      v-bind="attrs"
      :class="{ 'is-active': isSelected }"
      role="presentation"
    >
      <a ref="anchor" v-bind="tab">
        <slot :is-selected />
      </a>
    </li>
  </Tabs.Item>
</template>
