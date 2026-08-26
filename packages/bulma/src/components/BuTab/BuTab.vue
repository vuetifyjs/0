<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Utilities
  import { useAttrs } from 'vue'

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
</script>

<template>
  <!--
    :as="null" (NOT the renderless prop): `as` feeds TabsItem's button
    polyfill, so `renderless` alone would emit type="button" + disabled onto
    the anchor. Renderless items register no element, so v0's arrow-key focus
    moves (focusSelectedTab/focusAdjacent) are no-ops here: selection, panels,
    and aria-selected update but DOM focus stays on the previously selected
    anchor. Known Tier-1 limitation — see SPEC.md. role="presentation" lifts
    the <li> out of the accessibility tree so role=tablist directly owns the
    role=tab anchors (axe aria-required-children/-parent).
  -->
  <Tabs.Item
    v-slot="{ isSelected, attrs: tab }"
    :as="null"
    :disabled
    :value
  >
    <li
      v-bind="attrs"
      :class="{ 'is-active': isSelected }"
      role="presentation"
    >
      <a v-bind="tab">
        <slot :is-selected />
      </a>
    </li>
  </Tabs.Item>
</template>
