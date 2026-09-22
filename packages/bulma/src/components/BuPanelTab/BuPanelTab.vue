/**
 * @module BuPanelTab
 *
 * @remarks
 * A `.panel-tabs` anchor. Hand-picked bindings, not the Item attrs spread:
 * `aria-selected` / `aria-disabled` are invalid on role-less anchors (axe
 * aria-allowed-attr, critical) — `data-selected` keeps the data-attr styling
 * hook. Same convention as BuPanelBlock and BuMenu; see CANON.
 */

<script lang="ts">
  // Framework
  import { Single } from '@vuetify/v0'

  export interface BuPanelTabProps<V = unknown> {
    /** Selection value matched against the BuPanelTabs v-model. */
    value?: V
  }
</script>

<script lang="ts" setup generic="V = unknown">
  defineOptions({ name: 'BuPanelTab' })

  defineSlots<{
    /** Tab text. */
    default: () => any
  }>()

  const { value } = defineProps<BuPanelTabProps<V>>()
</script>

<template>
  <Single.Item
    v-slot="{ isSelected, select }"
    :value
  >
    <a
      :class="{ 'is-active': isSelected }"
      :data-selected="isSelected || undefined"
      @click="select"
    >
      <slot />
    </a>
  </Single.Item>
</template>
