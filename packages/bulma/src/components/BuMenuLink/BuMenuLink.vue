/**
 * @module BuMenuLink
 *
 * @remarks
 * Selectable `a` inside a BuMenuItem. Hand-picked bindings — `is-active`,
 * `data-selected`, `@click="select"` — never the Single.Item attrs spread
 * (aria-selected is invalid on a role-less anchor; see CANON).
 */

<script lang="ts">
  // Framework
  import { Single } from '@vuetify/v0'

  export interface BuMenuLinkProps<T = unknown> {
    /** Selection value matched against the BuMenu v-model */
    value: T
    /** Optional href for the anchor */
    href?: string
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'BuMenuLink' })

  defineSlots<{
    /** Anchor children — text, icons, or badges */
    default?: () => any
  }>()

  const { value, href } = defineProps<BuMenuLinkProps<T>>()
</script>

<template>
  <Single.Item
    v-slot="{ isSelected, select }"
    :value
  >
    <a
      :class="{ 'is-active': isSelected }"
      :data-selected="isSelected || undefined"
      :href
      @click="select"
    >
      <slot />
    </a>
  </Single.Item>
</template>
