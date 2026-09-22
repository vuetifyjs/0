/**
 * @module BuPanelBlock
 *
 * @remarks
 * A selectable `a.panel-block` row inside BuPanel's selection scope. Bulma's
 * non-anchor blocks (`label.panel-block`, `div.panel-block`) carry no state
 * and stay plain userland markup. Hand-picked bindings, not the Item attrs
 * spread — see BuPanelTab for why.
 */

<script lang="ts">
  // Framework
  import { Selection } from '@vuetify/v0'

  export interface BuPanelBlockProps<V = unknown> {
    /** Selection value matched against the BuPanel v-model. */
    value?: V
  }
</script>

<script lang="ts" setup generic="V = unknown">
  defineOptions({ name: 'BuPanelBlock' })

  defineSlots<{
    /** Row content — typically a BuPanelIcon followed by the label text. */
    default: () => any
  }>()

  const { value } = defineProps<BuPanelBlockProps<V>>()
</script>

<template>
  <Selection.Item
    v-slot="{ isSelected, select }"
    :value
  >
    <a
      class="panel-block"
      :class="{ 'is-active': isSelected }"
      :data-selected="isSelected || undefined"
      @click="select"
    >
      <slot />
    </a>
  </Selection.Item>
</template>
